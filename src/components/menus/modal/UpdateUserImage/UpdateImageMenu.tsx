import { useState } from "react";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { firebaseAuth } from "core/services/firebase";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { updateUserImageUrl } from "core/features/user/userSlice";
import { setModalState } from "core/features/modal/modalSlice";
import AppButton from "components/styled/AppButton/AppButton";

const UPLOAD_URL =  `${process.env.REACT_APP_PROJECT_API}/users/upload-user-image`;

const UpdateImageMenu = () => {
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");

  const handleCloseModal = async (url: string) => {
    dispatch(updateUserImageUrl(uploadedUrl));
    dispatch(setModalState({ visible: false, type: "", boxId: "", itemData: undefined, page: "" }));
  }

  return (
    <div style={{ padding: "20px 40px" }}>
      <FilePond
        files={files}
        allowMultiple={false}
        maxFiles={1}
        acceptedFileTypes={["image/png", "image/jpeg", "image/jpg", "image/webp"]}
        name="avatar"
        labelIdle='Drag & drop your image or <span class="filepond--label-action">Browse</span>'
        credits={false}
        onupdatefiles={(fileItems) => {
          setFiles(fileItems.map((fileItem) => fileItem.file as File));
        }}
        instantUpload={false}
        server={{
          process: async (fieldName, file, _metadata, load, error, progress, abort) => {
            try {
              const currentUser = firebaseAuth?.currentUser;
              const authToken = await currentUser?.getIdToken();

              const formData = new FormData();
              formData.append(fieldName, file);

              const request = new XMLHttpRequest();
              request.open("POST", UPLOAD_URL);
              request.setRequestHeader("Authorization", `Bearer ${authToken}`);

              request.upload.onprogress = (e) => {
                progress(e.lengthComputable, e.loaded, e.total);
              };

              request.onload = () => {
                if (request.status >= 200 && request.status < 300) {
                  const response = JSON.parse(request.responseText);
                  load(response.url);

                  if (response.url) {
                    setUploadedUrl(response.url);
                  }
                } else {
                  error("Upload failed");
                }
              };

              request.onerror = () => {
                error("Upload error");
              };

              request.onabort = () => {
                abort();
              };

              request.send(formData);
            } catch (err) {
              error("Failed to fetch auth token");
            }
          },
        }}
      />
      <AppButton
        onClick={() => handleCloseModal(uploadedUrl)}
        disabled={!uploadedUrl}
        text="Close and update"
      />
    </div>
  );
};

export default UpdateImageMenu;
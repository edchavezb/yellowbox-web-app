import styles from "./DeletePrompt.module.css";

function DeletePrompt({itemData, userBoxes, boxId, toggleModal, dispatch}) {

  let sectionType

  switch(itemData.type){
    case "artist":
      sectionType = "artists"
    break;
    case "album":
      sectionType = "albums"
    break;
    case "track":
      sectionType = "tracks"
    break;
    default:
  }

  const handleDeleteItem = () => {
    const targetIndex = userBoxes.findIndex(box => box.id === boxId)
    const targetBox = {...userBoxes.find(box => box.id === boxId)}
    const targetSection = targetBox[sectionType]
    const filteredSection = targetSection.filter(item => item.id !== itemData.id)
    let updatedBox = JSON.parse(JSON.stringify(targetBox))
    updatedBox[sectionType] = filteredSection
    dispatch({ type: "UPDATE_BOX", payload: { updatedBox: updatedBox, target: targetIndex } })
    toggleModal({ visible: false, type: "", boxId:"", itemData: ""})
  }

  return (
    <div id={styles.modalBody}>
      <div id={styles.confirmation}>
        <h3> Are you sure you want to remove this item from the box? </h3>
      </div>
      <div id={styles.modalFooter}>
        <button onClick={() => handleDeleteItem()}> Yes, delete item </button>
        <button onClick={() => toggleModal({ visible: false, type: "", boxId:"", itemData: "" })}> Cancel </button>
      </div>
    </div>
  )
}

export default DeletePrompt;
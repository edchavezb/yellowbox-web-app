export const cacheYupTest = (asyncValidate: (val: string) => Promise<boolean>) => {
  let _valid = false;
  let _value = '';

  return async (value: string) => {
    if (value !== _value) {
      const response = await asyncValidate(value);
      _value = value;
      _valid = response;
      return response;
    }
    return _valid;
  };
};
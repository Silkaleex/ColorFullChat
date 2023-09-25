import { useState } from "react";

export const useForm = (initialObject = {}) => {
  const [form, setForm] = useState(initialObject);

  const changed = ({ target }) => {
    const { name, value } = target;
    setForm({
      ...form,[name]:value
    });
    console.log(form)
  };
  return {
    form,
    changed,
  };
};

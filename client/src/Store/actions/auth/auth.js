export const Login = (data) => {
  return (dispatch) => {
    dispatch({
      type: "LOGIN",
      data: data,
    });
  };
};

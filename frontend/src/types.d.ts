type LoginForm = {
  email: string;
  password: string;
};

type LoginFormError = {
  email?: string;
  password?: string;
  general?: string;
};
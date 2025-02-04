import { ROUTES } from "@constants/routes";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type SignUpForm = {
  username: string;
  email: string;
  password: string;
};

export const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>();

  const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
    try {
      alert("현재 회원가입이 불가능합니다.");
      // await axios.post("https://opeak-back.onrender.com/api/auth/signup", data);
      // alert("회원가입 성공!");
      // navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 실패");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p>name</p> <input {...register("username")} />
        </div>
        <div>
          <p>email</p> <input {...register("email")} />
        </div>
        <div>
          <p>password</p>
          <input {...register("password", { required: true })} />
          {errors.password && <span>비밀번호를 입력해주세요</span>}
        </div>
        <input type="submit" />
      </form>
    </>
  );
};

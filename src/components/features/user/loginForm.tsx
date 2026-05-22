import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { InputAlt } from "../../ui/inputAlt";

function LoginForm() {
  return (
    <div className="w-full ">
      <form action="" className="">
        <div className="flex flex-col gap-4">
          <div>
            <Label className=" px-1 text-sm block">Email</Label>
            <InputAlt placeholder="example@example.com"  type="email" />
            {/* {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )} */}
          </div>
          <div>
            <Label className=" px-1 text-sm block">Password</Label>
            <InputAlt placeholder="password" type="password" />
            {/* {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )} */}
          </div>
          <Button className="mt-3">Login</Button>
          <p className="text-muted-foreground text-sm text-center w-full my-1">
            Don't have an account?
            <Link
              to={"/signup"}
              className="text-primary font-medium hover:underline mx-2"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;

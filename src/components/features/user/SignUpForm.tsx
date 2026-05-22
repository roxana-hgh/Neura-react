import { Link } from "react-router-dom";
import { Button } from "../../ui/button";

import { Label } from "../../ui/label";
import { InputAlt } from "../../ui/inputAlt";


function SignUpForm() {
  return (
    <div className="w-full ">
      <form action="" className="">
        <div className="flex flex-col gap-4">
          <div>
            <Label className="mb-1 px-1 text-sm block">Name</Label>
            <InputAlt placeholder="enter your name" />
            {/* {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )} */}
          </div>
          <div>
            <Label className="mb-1 px-1 text-sm block">Email</Label>
            <InputAlt placeholder="example@example.com" type="email" />
            {/* {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )} */}
          </div>
          <div>
            <Label className="mb-1 px-1 text-sm block">Password</Label>
            <InputAlt placeholder="Password" type="password" />
            {/* {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )} */}
          </div>
          <div>
            <Label className="mb-1 px-1 text-sm block">Confirm Password</Label>
            <InputAlt placeholder="Password" type="password" />
            {/* {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )} */}
          </div>
          <Button className="mt-3">Sign Up</Button>
          <p className="text-muted-foreground text-sm text-center w-full my-1">
            Already have an account?
            <Link
              to={"/login"}
              className="text-primary font-medium hover:underline mx-2"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignUpForm;

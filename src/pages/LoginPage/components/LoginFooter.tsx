import { Link } from "react-router-dom";

export function LoginFooter() {
  return (
    <div className="mt-6 text-sm text-center sm:text-base text-neutral700">
      Don't have an account ?{' '}
      <Link to="/register" className="font-medium text-primary hover:text-primaryDark">
        Sign up
      </Link>
    </div>
  );
}



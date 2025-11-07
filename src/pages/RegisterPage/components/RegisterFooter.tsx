import { Link } from "react-router-dom";

export function RegisterFooter() {
  return (
    <div className="mt-6 text-sm text-center sm:text-base text-neutral700">
      Already have an account ?{' '}
      <Link to="/login" className="font-medium text-primary hover:text-primaryDark">
        Login
      </Link>
    </div>
  );
}
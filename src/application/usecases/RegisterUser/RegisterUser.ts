import { RegisterUser } from "@/domain/models/RegisterUser";
import type { RegisterRequest, RegisterResult, RegisterUserGateway } from "./RegisterUser.types";

export function createRegisterUserUsecase(gateway: RegisterUserGateway) {
  return async (request: RegisterRequest): Promise<RegisterResult> => {
    const user = new RegisterUser(
      request.firstname.trim(),
      request.lastname.trim(),
      request.email.trim(),
      request.password
    );

    return gateway.register({
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      password: user.password,
    });
  };
}

import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class FTGuard extends AuthGuard('42') {
    async canActivate(context: ExecutionContext) {
    try {
        const result = await super.canActivate(context) as boolean;
        return true;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return result;
    } catch(error) {
        console.log(error);
    }
  }
}

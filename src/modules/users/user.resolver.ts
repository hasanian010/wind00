import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

// Service
import { UserService } from './user.service';


// DTOs
import { SignupInput } from './dto/signup.dto';
import { VerifyPhoneInput } from './dto/verify-phone.dto';
import { LoginInput } from './dto/login.dto';
import { UpdateUserInput } from './dto/update.dto';
// اصلاح import ها برای رفع خطاها
import { ChangePasswordInput } from './dto/change-password.dto';
import { ForgetPasswordInput } from './dto/forget-password.dto';
import { ResetPasswordInput } from './dto/reset-password.dto';
import { PhoneInput } from './dto/phone.dto';
import { ChangePhoneVerifyInput } from './dto/change-phone-verify.dto';
import { SearchInput } from './dto/search.dto';
import { AdminInput } from './dto/admin.dto';

// Entities
import { User, GetUsers } from './entities/user.entity';
import { SuccessInfo } from './entities/success.entity';

// Guards and Roles - placeholders, replace with actual implementations or remove if not available
// import { Roles } from 'auth/decorator/auth.decorator';
// import { Role } from 'auth/enum/auth.enum';
// import { AuthGuard } from 'auth/auth.guard';
// import { RolesGuard } from 'auth/roles.guard';

// ReqUser type placeholder
// import { ReqUser } from 'auth/entities/user.types';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: 'getProfile' })
  // @UseGuards(AuthGuard)
  getProfile(@Context('user') reqUser: any) {
    return this.userService.getProfile(reqUser);
  }

  @Query(() => GetUsers, { name: 'getUsers' })
  // @Roles(Role.MODERATOR, Role.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  getUsers(@Args('searchInput') searchInput: SearchInput) {
    return this.userService.getUsers(searchInput);
  }

  @Query(() => GetUsers, { name: 'getAdmins' })
  // @Roles(Role.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  getAdmins(@Args('searchInput') searchInput: SearchInput) {
    return this.userService.getAdmins(searchInput);
  }

  @Mutation(() => SuccessInfo, { name: 'signup' })
  signup(@Args('signupInput') signupInput: SignupInput) {
    return this.userService.signup(signupInput);
  }

  @Mutation(() => SuccessInfo, { name: 'addAdmins' })
  // @Roles(Role.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  addAdmin(@Args('adminInput') adminInput: AdminInput) {
    return this.userService.addAdmin(adminInput);
  }

  @Mutation(() => SuccessInfo, { name: 'resendOtp' })
  resend(@Args('phone', { type: () => String }) phone: string) {
    return this.userService.resend(phone);
  }

  @Mutation(() => SuccessInfo, { name: 'phoneLogin' })
  phoneLogin(@Args('phone', { type: () => String }) phone: string) {
    return this.userService.phoneLogin(phone);
  }

  @Mutation(() => SuccessInfo, { name: 'verifyPhone' })
  verify(@Args('verifyPhoneInput') verifyPhoneInput: VerifyPhoneInput, @Context('req') req: any) {
    return this.userService.verify(verifyPhoneInput, req);
  }

  @Mutation(() => SuccessInfo, { name: 'login' })
  login(@Args('loginInput') loginInput: LoginInput, @Context('req') req: any) {
    return this.userService.login(loginInput, req);
  }

  @Mutation(() => SuccessInfo, { name: 'loginAdmin' })
  adminLogin(@Args('loginInput') loginInput: LoginInput, @Context('req') req: any) {
    return this.userService.adminLogin(loginInput, req);
  }

  @Mutation(() => SuccessInfo, { name: 'loginSeller' })
  sellerLogin(@Args('loginInput') loginInput: LoginInput, @Context('req') req: any) {
    return this.userService.sellerLogin(loginInput, req);
  }

  @Mutation(() => SuccessInfo, { name: 'updateProfile' })
  // @UseGuards(AuthGuard)
  update(@Args('updateUserInput') updateUserInput: UpdateUserInput, @Context('user') reqUser: any) {
    return this.userService.update(updateUserInput, reqUser);
  }

  @Mutation(() => SuccessInfo, { name: 'changePassword' })
  // @UseGuards(AuthGuard)
  changePassword(@Args('changePasswordInput') changePasswordInput: ChangePasswordInput, @Context('user') reqUser: any) {
    return this.userService.changePassword(changePasswordInput, reqUser);
  }

  @Mutation(() => SuccessInfo, { name: 'forgetPassword' })
  forgetPassword(@Args('forgetPasswordInput') forgetPasswordInput: ForgetPasswordInput) {
    return this.userService.forgetPassword(forgetPasswordInput);
  }

  @Mutation(() => SuccessInfo, { name: 'resetPassword' })
  resetPassword(@Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput) {
    return this.userService.resetPassword(resetPasswordInput);
  }

  @Mutation(() => SuccessInfo, { name: 'phoneAvailability' })
  // @UseGuards(AuthGuard)
  available(@Args('phoneInput') phoneInput: PhoneInput) {
    return this.userService.available(phoneInput);
  }

  @Mutation(() => SuccessInfo, { name: 'changePhone' })
  // @UseGuards(AuthGuard)
  changePhone(@Args('phoneInput') phoneInput: PhoneInput, @Context('user') reqUser: any) {
    return this.userService.phoneChange(phoneInput, reqUser);
  }

  @Mutation(() => SuccessInfo, { name: 'changePhoneVerify' })
  // @UseGuards(AuthGuard)
  changePhoneVerify(@Args('changePhoneVerifyInput') changePhoneVerifyInput: ChangePhoneVerifyInput, @Context('user') reqUser: any) {
    return this.userService.changePhoneVerify(changePhoneVerifyInput, reqUser);
  }

  @Mutation(() => SuccessInfo, { name: 'banOrUnbannedUser' })
  // @Roles(Role.MODERATOR, Role.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  ban(@Args('id', { type: () => String }) id: string, @Args('status', { type: () => Boolean }) status: boolean) {
    return this.userService.ban(id, status);
  }

  @Mutation(() => SuccessInfo, { name: 'removeAdmin' })
  // @Roles(Role.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  remove(@Args('id', { type: () => String }) id: string) {
    return this.userService.remove(id);
  }
}

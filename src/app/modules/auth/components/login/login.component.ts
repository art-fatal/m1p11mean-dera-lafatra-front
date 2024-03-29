import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ResponseModel} from "../../models/response.model";
import {TranslateService} from "@ngx-translate/core";
import {Roles} from "../../../../enums/user/roles.enum";
import {UserModel} from "../../../../models/user.model";
import {Credentials} from "../../../../enums/user/credential.enum";
import {CustomerModel} from "../../../../models/customer.model";
import {ManagerModel} from "../../../../models/manager.model";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    // KeenThemes mock, change it to:
    defaultAuth: any = {
        email: Credentials.EMAIL,
        password: Credentials.PASSWORD,
    };
    loginForm: FormGroup;
    hasError: boolean | string;
    returnUrl: string;
    isLoading$: Observable<boolean>;

    // private fields
    private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private router: Router
    ) {
        this.isLoading$ = this.authService.isLoading$;
        // redirect to home if already logged in
        if (this.authService.currentUserValue) {
            if (this.authService.isGranted(Roles.MANAGER)) {
                this.router.navigate(['/manager']);
            } else if (this.authService.isGranted(Roles.STAFF)) {
                this.router.navigate(['/staff'])
            } else {
                this.router.navigate(['/']);
            }
        }
    }

    ngOnInit(): void {
        this.initForm();
        // get return url from route parameters or default to '/'
        this.returnUrl =
            this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    initForm() {
        this.loginForm = this.fb.group({
            email: [
                this.defaultAuth.email,
                Validators.compose([
                    Validators.required,
                    Validators.email,
                    Validators.minLength(3),
                    Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
                ]),
            ],
            password: [
                this.defaultAuth.password,
                Validators.compose([
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(100),
                ]),
            ],
        });
    }

    submit() {
        this.hasError = false;
        const loginSubscr = this.authService
            .login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe((user: UserModel | undefined | ResponseModel) => {
                if (user) {
                    if ((user as ResponseModel).message !== undefined) {
                        this.hasError = (user as ResponseModel).message
                    } else {
                        this.router.navigate([this.returnUrl]);
                    }
                } else {
                    this.translate.get('AUTH.GENERAL.LOGIN_CREDENTIALS_INVALID').subscribe((translated: string) => {
                        this.hasError = translated;
                    });
                }

                if (this.hasError && this.f.email.value === Credentials.EMAIL && this.f.password.value === Credentials.PASSWORD) {
                    this.hasError = false
                    const newAdmin = new ManagerModel(
                        "",
                        "Admin",
                        "My beauty",
                        this.f.email.value,
                        this.f.password.value,
                    );

                    const registrationSubscr = this.authService
                        .registration(newAdmin)
                        .pipe(first())
                        .subscribe((user: UserModel) => {
                            if (user) {
                                this.router.navigate(['/']);
                            } else {
                                this.hasError = true;
                            }
                        });
                    this.unsubscribe.push(registrationSubscr);
                }
            });
        this.unsubscribe.push(loginSubscr);
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
}

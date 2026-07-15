'use client';

import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useForm, type FieldValues, type Path, type UseFormSetError } from 'react-hook-form';
import type { z } from 'zod';

import { Button, Input, Select, Textarea } from '../../../shared/components';
import { AuthApiError } from '../model/auth-types';
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from '../model/auth-schemas';
import { useAuth } from '../model/use-auth';

const dimensionOptions = [
  { label: 'Oraculo Norte', value: 'oraculo-norte' },
  { label: 'Distrito Cronal', value: 'distrito-cronal' },
  { label: 'Archivo Horizonte', value: 'archivo-horizonte' },
] as const;

type AuthMode = 'login' | 'register';

const authTabIds: Record<AuthMode, string> = {
  login: 'auth-tab-login',
  register: 'auth-tab-register',
};

const authPanelIds: Record<AuthMode, string> = {
  login: 'auth-panel-login',
  register: 'auth-panel-register',
};

function getErrorMessage(error: unknown): string {
  if (error instanceof AuthApiError) {
    if (error.code === 'INVALID_CREDENTIALS') {
      return 'No hemos podido abrir tu portal. Revisa correo y contrasena.';
    }

    if (error.code === 'EMAIL_ALREADY_REGISTERED') {
      return 'Ese correo ya esta registrado en Wormarket.';
    }

    if (error.code === 'USERNAME_ALREADY_REGISTERED') {
      return 'Ese alias ya pertenece a otra persona.';
    }

    if (error.code === 'DIMENSION_NOT_FOUND') {
      return 'La dimension de origen no existe en el mercado local.';
    }

    return error.message;
  }

  return 'Ha ocurrido un error inesperado.';
}

function applySchemaErrors<TValues extends FieldValues>(
  error: z.ZodError<TValues>,
  setError: UseFormSetError<TValues>,
): void {
  let shouldFocus = true;

  for (const issue of error.issues) {
    const fieldName = issue.path[0];

    if (typeof fieldName === 'string') {
      setError(
        fieldName as Path<TValues>,
        {
          message: issue.message,
          type: 'manual',
        },
        { shouldFocus },
      );
      shouldFocus = false;
    }
  }
}

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');
  const loginTabRef = useRef<HTMLButtonElement>(null);
  const registerTabRef = useRef<HTMLButtonElement>(null);
  const { isAuthenticated, isCheckingSession, user } = useAuth();
  const isLoggedIn = isAuthenticated && Boolean(user);

  function selectAuthMode(nextMode: AuthMode): void {
    setMode(nextMode);

    if (nextMode === 'login') {
      loginTabRef.current?.focus();
      return;
    }

    registerTabRef.current?.focus();
  }

  function handleAuthTabsKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      selectAuthMode(mode === 'login' ? 'register' : 'login');
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      selectAuthMode(mode === 'login' ? 'register' : 'login');
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      selectAuthMode('login');
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      selectAuthMode('register');
    }
  }

  return (
    <section className="auth-page" aria-labelledby="auth-title">
      <div className="auth-intro">
        <p className="eyebrow">Tu cuenta</p>
        <h1 id="auth-title">{isLoggedIn ? 'Tu portal Wormarket' : 'Accede a Wormarket'}</h1>
        <p>
          {isLoggedIn
            ? 'Gestiona tu sesion y continua recorriendo el mercado con tu identidad activa.'
            : 'Inicia sesion o crea una cuenta para guardar favoritos, vender objetos y hablar con otros viajeros del mercado.'}
        </p>
      </div>

      <div className={isLoggedIn ? 'auth-grid auth-grid-session-only' : 'auth-grid'}>
        {!isLoggedIn ? (
          <div className="auth-panel">
            <div
              className="auth-tabs"
              onKeyDown={handleAuthTabsKeyDown}
              role="tablist"
              aria-label="Opciones de autenticacion"
            >
              <button
                aria-controls={authPanelIds.login}
                aria-selected={mode === 'login'}
                className="auth-tab"
                id={authTabIds.login}
                onClick={() => setMode('login')}
                ref={loginTabRef}
                role="tab"
                tabIndex={mode === 'login' ? 0 : -1}
                type="button"
              >
                Iniciar sesion
              </button>
              <button
                aria-controls={authPanelIds.register}
                aria-selected={mode === 'register'}
                className="auth-tab"
                id={authTabIds.register}
                onClick={() => setMode('register')}
                ref={registerTabRef}
                role="tab"
                tabIndex={mode === 'register' ? 0 : -1}
                type="button"
              >
                Crear cuenta
              </button>
            </div>

            <div
              aria-labelledby={authTabIds.login}
              hidden={mode !== 'login'}
              id={authPanelIds.login}
              role="tabpanel"
            >
              {mode === 'login' ? <LoginForm /> : null}
            </div>
            <div
              aria-labelledby={authTabIds.register}
              hidden={mode !== 'register'}
              id={authPanelIds.register}
              role="tabpanel"
            >
              {mode === 'register' ? <RegisterForm /> : null}
            </div>
          </div>
        ) : null}

        <aside className="auth-panel auth-session" aria-labelledby="session-title">
          <p className="eyebrow">Bienvenida</p>
          <h2 id="session-title">
            {isLoggedIn && user ? `Hola, ${user.displayName}` : 'Entra en tu cuenta'}
          </h2>

          {isLoggedIn && user ? (
            <>
              <p className="auth-session-summary">
                Has iniciado sesion como <strong>@{user.username}</strong>. Ya puedes guardar
                favoritos, enviar ofertas y vender objetos imposibles.
              </p>
              <Button href="/#explorar" variant="secondary">
                Explorar
              </Button>
            </>
          ) : (
            <p>
              {isCheckingSession
                ? 'Comprobando la sesion local...'
                : 'Accede para gestionar tus anuncios, favoritos y conversaciones.'}
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues): Promise<void> {
    setFormError(null);
    const result = loginSchema.safeParse(values);

    if (!result.success) {
      applySchemaErrors(result.error, setError);
      return;
    }

    try {
      await login(result.data);
    } catch (error: unknown) {
      setFormError(getErrorMessage(error));
    }
  }

  function handleLoginSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  }

  return (
    <form className="auth-form" method="post" onSubmit={handleLoginSubmit}>
      <Input
        autoComplete="email"
        error={errors.email?.message}
        label="Correo dimensional"
        type="email"
        {...register('email')}
      />
      <Input
        autoComplete="current-password"
        error={errors.password?.message}
        label="Contrasena"
        type="password"
        {...register('password')}
      />

      {formError ? (
        <p className="auth-error" role="alert">
          {formError}
        </p>
      ) : null}

      <Button type="submit">{isSubmitting ? 'Abriendo portal...' : 'Iniciar sesion'}</Button>
    </form>
  );
}

function RegisterForm() {
  const { register: registerIdentity } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      bio: '',
      displayName: '',
      email: '',
      homeDimensionSlug: dimensionOptions[0].value,
      password: '',
      username: '',
    },
  });

  async function onSubmit(values: RegisterFormValues): Promise<void> {
    setFormError(null);
    const result = registerSchema.safeParse(values);

    if (!result.success) {
      applySchemaErrors(result.error, setError);
      return;
    }

    try {
      await registerIdentity(result.data);
    } catch (error: unknown) {
      setFormError(getErrorMessage(error));
    }
  }

  function handleRegisterSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  }

  return (
    <form className="auth-form" method="post" onSubmit={handleRegisterSubmit}>
      <Input
        autoComplete="name"
        error={errors.displayName?.message}
        label="Nombre visible"
        {...register('displayName')}
      />
      <Input
        autoComplete="username"
        error={errors.username?.message}
        hint="Usa minusculas, numeros y guiones."
        label="Alias publico"
        {...register('username')}
      />
      <Input
        autoComplete="email"
        error={errors.email?.message}
        label="Correo dimensional"
        type="email"
        {...register('email')}
      />
      <Input
        autoComplete="new-password"
        error={errors.password?.message}
        hint="Minimo 8 caracteres, con letras y numeros."
        label="Contrasena"
        type="password"
        {...register('password')}
      />
      <Select
        error={errors.homeDimensionSlug?.message}
        label="Dimension de origen"
        {...register('homeDimensionSlug')}
      >
        {dimensionOptions.map((dimension) => (
          <option key={dimension.value} value={dimension.value}>
            {dimension.label}
          </option>
        ))}
      </Select>
      <Textarea error={errors.bio?.message} label="Biografia dimensional" {...register('bio')} />

      {formError ? (
        <p className="auth-error" role="alert">
          {formError}
        </p>
      ) : null}

      <Button type="submit">{isSubmitting ? 'Creando identidad...' : 'Crear cuenta'}</Button>
    </form>
  );
}

import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useClient, useMutation } from "urql";
import { Login as LoginMutation } from "../../graphql/mutations/user";
import { UserRegistered as UserRegisteredQuery } from "../../graphql/queries/user";

const Login = ({ isRegistered, setIsRegistered, setIsLogin, setEmail }) => {
  const [, loginMutation] = useMutation(LoginMutation);

  const client = useClient();

  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  // Check if input email is registered
  const onEmailSubmit = async (values) => {
    const { email } = values;

    const {
      data: { userRegistered },
    } = await client.query(UserRegisteredQuery, { email }).toPromise();

    // User not registered
    if (!userRegistered) {
      setEmail(email);
      return setIsLogin(false);
    }

    // User registered, proceed to login
    return setIsRegistered(true);
  };

  // Log user in
  const onLoginSubmit = async (values) => {
    const { email, password } = values;

    const { data } = await loginMutation({
      input: { email, password },
    });

    // Handle server errors
    if (data?.login.errors) {
      const serverErrors = data.login.errors;

      // Set manual form errors
      serverErrors.forEach(({ field, message }) =>
        setError(field, { type: "manual", message })
      );
    } else if (data?.login.user) {
      // Login successful, redirect home
      router.push("/");
    }
  };

  const emailRegister = register("email", {
    required: "Please input an email.",
    pattern: {
      // Minimal email validation
      value: /\S+@\S+\.\S+/,
      message: "Please input a valid email address",
    },
  });

  // Individual registration allows for onChange destructure
  const { onChange, ...passwordRegister } =
    isRegistered &&
    register("password", {
      required: "This field is required",
    });

  // Reset global errors on password field change
  const handlePasswordChange = (e) => {
    if (errors.credentials) {
      clearErrors("credentials");
    }
    // Must pass onChange to keep useForm default bahaviour
    onChange(e);
  };

  return (
    <Flex {...styles.wrapper}>
      <form
        onSubmit={
          !isRegistered
            ? handleSubmit(onEmailSubmit)
            : handleSubmit(onLoginSubmit)
        }
        style={styles.form}
      >
        <Flex {...styles.field}>
          <Input
            placeholder="Your email"
            autoComplete="off"
            {...styles.input}
            {...emailRegister}
          />
          {errors.email && (
            <Text {...styles.error}>{errors.email.message}</Text>
          )}
        </Flex>

        {isRegistered && (
          <Flex {...styles.field}>
            <Input
              type="password"
              placeholder="Your password"
              {...styles.input}
              {...passwordRegister}
              onChange={handlePasswordChange}
            />
            {errors.password && (
              <Text {...styles.error}>{errors.password.message}</Text>
            )}
          </Flex>
        )}

        {errors.credentials && (
          <Text {...styles.error} marginTop="-3">
            {errors.credentials.message}
          </Text>
        )}

        <Button type="submit" {...styles.button}>
          {!isRegistered ? "Next" : "Log in"}
        </Button>
      </form>
    </Flex>
  );
};

export { Login };

// Styles

const styles = {
  wrapper: {
    direction: "column",
    width: "100%",
  },
  form: {
    width: "100%",
  },
  field: {
    direction: "column",
    paddingBottom: "0.75em",
  },
  input: {
    spellCheck: false,
    paddingY: "1.25em",
  },
  error: {
    fontSize: "sm",
    color: "link",
    paddingTop: "1",
    paddingBottom: "2",
    lineHeight: "1em",
  },
  button: {
    variant: "brand",
    width: "100%",
  },
};

import { CheckIcon } from "@chakra-ui/icons";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import { Signup as SignupMutation } from "../../graphql/mutations/user";

const Signup = ({ setIsLogin, email }) => {
  const [, signupMutation] = useMutation(SignupMutation);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  // Sign user up
  const onSubmit = async (values) => {
    const { email, name, password } = values;

    const { data } = await signupMutation({
      input: { email, name, password },
    });

    // Handle server errors
    if (data?.signup.errors) {
      const serverErrors = data.signup.errors;

      // Set manual form errors
      serverErrors.forEach(({ field, message }) =>
        setError(field, { type: "manual", message })
      );
    } else if (data?.signup.user) {
      // Signup successful, redirect home
      router.push("/");
    }
  };

  const emailRegister = register("email", {
    required: "What's your email?",
    pattern: {
      // Minimal email validation
      value: /\S+@\S+\.\S+/,
      message: "Please input a valid email address",
    },
  });

  const nameRegister = register("name", {
    required: "How should everyone know you?",
  });

  const passwordRegister = register("password", {
    required: "Please input a password.",
  });

  return (
    <Flex {...styles.wrapper}>
      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <Flex {...styles.field}>
          <Input
            defaultValue={email}
            placeholder="Your email"
            {...styles.input}
            {...emailRegister}
          />
          {errors.email && (
            <Text {...styles.error}>{errors.email.message}</Text>
          )}
        </Flex>

        <Flex {...styles.field}>
          <Input placeholder="Your name" {...styles.input} {...nameRegister} />
          {errors.name && <Text {...styles.error}>{errors.name.message}</Text>}
        </Flex>

        <Flex {...styles.field}>
          <Input
            type="password"
            placeholder="Your password"
            {...styles.input}
            {...passwordRegister}
          />
          {errors.password && (
            <Text {...styles.error}>{errors.password.message}</Text>
          )}
        </Flex>

        {errors.credentials && (
          <Text {...styles.error}>{errors.credentials.message}</Text>
        )}

        <Button
          type="submit"
          {...styles.button}
          rightIcon={<CheckIcon boxSize="0.75em" />}
        >
          Sign up
        </Button>
        <Button {...styles.backButton} onClick={() => setIsLogin(true)}>
          Wrong email?
        </Button>
      </form>
    </Flex>
  );
};

export { Signup };

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
    paddingBottom: "0.5em",
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
    marginY: "0.5em",
  },
  backButton: {
    variant: "link",
    size: "md",
    paddingY: "1em",
    width: "100%",
  },
};

import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

export const LoginForm = () => {
  const [user, setUser] = useState<string>();
  const [password, setPassword] = useState<string>();
  return (
    <form
      style={{
        flexDirection: "column",
        display: "flex",
        width: "100%",
        gap: 16,
        padding: 16,
      }}
      onSubmit={(e) => {
        e.preventDefault();
        console.log({ user, password });
      }}
    >
      <TextField
        label="usuario"
        placeholder="Usuario o correo"
        onChange={(e) => setUser(e.target.value)}
        type="email"
        required
      />

      <TextField
        label="Contraseña"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" variant="outlined">
        Iniciar sesion
      </Button>
    </form>
  );
};

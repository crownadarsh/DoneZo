package com.crown.DoneZo.dto.input;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginDto {

    @NotNull(message = "Email must not be null")
    @NotBlank(message = "Email must not be blank")
    @Email(message = "Invalid email format")
    @Pattern(regexp = "^[^'\";]+$", message = "Email contains illegal characters that could lead to SQL injection")
    private String email;

    @NotNull(message = "Password must not be null")
    @NotBlank(message = "Password must not be blank")
    @Pattern(regexp = "^[^'\";]+$", message = "Password contains illegal characters that could lead to SQL injection")
    private String password;

}

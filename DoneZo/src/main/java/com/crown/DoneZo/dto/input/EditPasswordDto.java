package com.crown.DoneZo.dto.input;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EditPasswordDto {

    @NotNull(message = "Old password must not be null")
    @NotBlank(message = "Old password must not be blank")
    @Size(min = 8, message = "Old password must be at least 8 characters long")
    private String oldPassword;

    @NotNull(message = "New password must not be null")
    @NotBlank(message = "New password must not be blank")
    @Size(min = 8, message = "New password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=]).{8,}$",
            message = "New password must contain at least one digit, one letter, and one special character (@#$%^&+=)")
    private String newPassword;
}

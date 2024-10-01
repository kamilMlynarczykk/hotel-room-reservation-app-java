package com.kamil.room_resrvation_app.service;

import com.kamil.room_resrvation_app.persistance.model.AppUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoder;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

public interface JwtService {

    public boolean isTokenValid(String token, UserDetails userDetails);

    private boolean isTokenExpired(String token) {
        return false;
    }

    private Date extractExpiration(String token) {
        return null;
    }

    public String extractUsername(String token);

    public <T> T extractClaim(String token, Function<Claims,T> resolver);

    private Claims getAllClaimsFromToken(String token) {
        return null;
    }

    public String generateToken(AppUser appUser);

    private SecretKey getSigninKey() {
        return null;
    }
}

package com.LinkVerse.Friend.configuration;

import com.nimbusds.jwt.SignedJWT;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.Map;

@Component
public class CustomJwtDecoder implements JwtDecoder {
    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            Map<String, Object> claims = signedJWT.getJWTClaimsSet().getClaims();
            String userId = signedJWT.getJWTClaimsSet().getStringClaim("sub");
            claims.put("user_id", userId);
            return new Jwt(token,
                    signedJWT.getJWTClaimsSet().getIssueTime().toInstant(),
                    signedJWT.getJWTClaimsSet().getExpirationTime().toInstant(),
                    signedJWT.getHeader().toJSONObject(),
                    claims
            );

        } catch (ParseException e) {
            throw new JwtException("Invalid token");
        }
    }
}

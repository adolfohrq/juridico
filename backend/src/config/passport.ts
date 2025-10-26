import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from './database';
import { JWTPayload } from '../types';

// JWT Strategy
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload: JWTPayload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (user && user.ativo) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Buscar usuário existente pelo Google ID
          let user = await prisma.user.findUnique({
            where: { google_id: profile.id },
          });

          // Se não encontrar, buscar por email
          if (!user && profile.emails && profile.emails[0]) {
            user = await prisma.user.findUnique({
              where: { email: profile.emails[0].value },
            });

            // Se encontrou por email, atualizar com Google ID
            if (user) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: {
                  google_id: profile.id,
                  avatar_url: profile.photos?.[0]?.value,
                },
              });
            }
          }

          // Se ainda não existe, criar novo usuário (apenas se email estiver disponível)
          if (!user && profile.emails && profile.emails[0]) {
            user = await prisma.user.create({
              data: {
                email: profile.emails[0].value,
                full_name: profile.displayName || 'Usuário Google',
                google_id: profile.id,
                avatar_url: profile.photos?.[0]?.value,
                cargo: 'TECNICO', // Cargo padrão para novos usuários Google
                ativo: true,
              },
            });
          }

          return done(null, user || false);
        } catch (error) {
          return done(error as Error, false);
        }
      }
    )
  );
}

export default passport;

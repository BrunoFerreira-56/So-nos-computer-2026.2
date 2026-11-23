/**
 * Tela:   Perfil do vendedor · Avaliar usuário · Avaliação registrada (e "Meu perfil" em /perfil/me)
 * Figma:  D10 (83:5201) · D10b (83:5250) · D10c (83:5322)
 * US:     US13, US14
 * RF/RNF: RF13, RF14
 */
import { Suspense } from "react";
import { ProfileSkeleton, ProfileView } from "@/features/profile/components/profile-view";

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileView />
    </Suspense>
  );
}

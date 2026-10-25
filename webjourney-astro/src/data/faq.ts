// FAQ de la home : chaque question lève une objection avant le premier appel.
// Réponses reprises des FAQ de `/creation-site-internet` et `/creation-site-vitrine`.
import type { FaqItem } from "../components/Faq.astro";

export const homeFaq: FaqItem[] = [
  {
    question: "Combien coûte un site internet ?",
    answer:
      "Une landing page démarre à CHF 990.–, un site vitrine complet coûte CHF 2'990.–. Les projets avec réservation, e-commerce ou application font l'objet d'un devis précis après un premier échange.",
  },
  {
    question: "En combien de temps mon site est-il en ligne ?",
    answer:
      "Comptez 3 à 6 semaines pour un site vitrine et environ deux mois pour un projet sur-mesure. On fixe une date ensemble au départ, et on la tient.",
  },
  {
    question: "Est-ce que je suis propriétaire de mon site ?",
    answer:
      "Oui. Une fois le site livré et payé, le code, le design et les contenus vous appartiennent. Aucune plateforme qui vous enferme, aucun frais si vous changez d'agence un jour.",
  },
  {
    question: "Pourrai-je modifier mon site moi-même ?",
    answer:
      "Oui. Le site vitrine inclut un accompagnement pour prendre en main votre site. Si vous changez souvent textes et images, nous intégrons un outil simple qui évite de toucher au code : on en parle au cadrage.",
  },
  {
    question: "Que se passe-t-il après la mise en ligne ?",
    answer:
      "Le site vitrine inclut 2 mois de support. Ensuite, l'abonnement maintenance et sécurité (CHF 99.– / mois, sans engagement) couvre les mises à jour, les sauvegardes et la surveillance.",
  },
  {
    question: "Mon site apparaîtra-t-il dans ChatGPT et les autres IA ?",
    answer:
      "Chaque site est construit pour être lu facilement par Google et par les IA comme ChatGPT, Perplexity ou les réponses IA de Google : pages rapides et lisibles, données structurées qui décrivent votre entreprise, contenus organisés en questions et réponses. Personne ne peut garantir qu'une IA vous citera, mais ces bases mettent toutes les chances de votre côté.",
  },
  {
    question: "Pourquoi pas Wix, ou un freelance à 300 francs ?",
    answer:
      "Avec Wix, vous construisez seul, vous y passez vos soirées, et le site reste chez Wix : vous ne pouvez pas l'emporter. Un site à 300 francs est rarement pensé pour Google ou pour convertir. Nous livrons un site sur-mesure et rapide, qui transforme vos visiteurs en clients, qui vous appartient, avec quelqu'un à appeler quand vous en avez besoin.",
  },
];

/** Données structurées FAQPage, à partir des mêmes questions que l'accordéon. */
export function faqStructuredData(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

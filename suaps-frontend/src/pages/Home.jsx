export default function Home() {
  return (
    <main id="top" className="bg-gradient-to-br from-slate-50 to-blue-50">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Sportive background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-suaps-blue to-suaps-red" />
          <div className="absolute top-0 left-0 w-full h-full bg-repeat" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23205187' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                 backgroundSize: '60px 60px'
               }} />
        </div>
        
        <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="animate-fade-in">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-suaps-blue shadow-sm">
                <span className="mr-2 text-base">🏃‍♂️</span>
                SUAPS • Université du Littoral Côte d'Opale
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-suaps-blue md:text-5xl lg:text-6xl">
                Découvrez et gérez vos{" "}
                <span className="text-suaps-red">activités sportives</span>
              </h1>

              <p className="mt-4 text-base leading-7 text-slate-600">
                Une plateforme complète pour consulter les activités, effectuer
                vos inscriptions sportives, déposer les documents nécessaires et suivre
                vos validations.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-lg bg-suaps-red px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-red-600 transition-colors"
                >
                  Créer un compte
                </a>
                <a
                  href="#about"
                  className="inline-flex items-center justify-center rounded-lg border border-suaps-blue/20 bg-white px-6 py-3 text-sm font-semibold text-suaps-blue shadow-sm hover:bg-suaps-blue hover:text-white transition-colors"
                >
                  En savoir plus
                </a>
              </div>
            </div>

            {/* Enhanced Carte à droite */}
            <div className="relative">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-suaps-blue rounded-lg flex items-center justify-center text-white text-lg font-semibold mr-3">
                    🎯
                  </div>
                  <h2 className="text-xl font-bold text-suaps-blue">
                    Ce que vous pouvez faire
                  </h2>
                </div>

                <div className="space-y-4">
                  <FeatureRow
                    title="Consulter les activités"
                    text="Filtrer par catégorie, site, période (S1/S2) et visibilité."
                    icon="🏀"
                    color="blue"
                  />
                  <FeatureRow
                    title="S'inscrire et suivre le statut"
                    text="Demande en cours, validée ou refusée selon le traitement."
                    icon="📝"
                    color="green"
                  />
                  <FeatureRow
                    title="Documents & évaluations"
                    text="Déposer un certificat médical et consulter les notes."
                    icon="📊"
                    color="purple"
                  />
                </div>

                <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-lg mr-2">💡</span>
                    <p className="text-sm font-semibold text-suaps-blue">
                      Astuce
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 leading-5">
                    Commencez par créer votre compte, puis choisissez votre activité
                    préférée et envoyez votre demande d'inscription.
                  </p>
                </div>
              </div>

              {/* Enhanced décor */}
              <div className="pointer-events-none absolute -right-8 -top-8 w-24 h-24 bg-suaps-blue/10 rounded-full blur-xl" />
              <div className="pointer-events-none absolute -left-8 -bottom-8 w-24 h-24 bg-suaps-red/10 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* À PROPOS */}
      <section id="about" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-suaps-blue rounded-xl text-white text-2xl mb-4 mx-auto shadow-md">
              🏟️
            </div>
            <h2 className="text-3xl font-bold text-suaps-blue mb-4">
              À propos de la plateforme
            </h2>
            <p className="text-base leading-7 text-slate-600">
              Cette application facilite la gestion des activités du SUAPS :
              inscription des étudiants, validation par les moniteurs, gestion
              des activités (catégories, sites, types d'événements) et suivi des
              évaluations.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card
              title="🎓 Étudiants"
              text="S'inscrire aux activités, déposer des documents, suivre les statuts (en cours / validé / refusé)."
            />
            <Card
              title="👨‍🏫 Moniteurs"
              text="Valider les inscriptions et réaliser les évaluations."
            />
            <Card
              title="🏢 Personnel"
              text="Créer et modifier les activités, gérer les catégories, sites et événements."
            />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-suaps-red to-red-600 rounded-2xl text-white text-3xl mb-6 mx-auto shadow-xl">
              📧
            </div>
            <h2 className="text-4xl font-bold text-suaps-blue mb-4">
              Contact
            </h2>
            <p className="text-lg leading-7 text-slate-600">
              Une question ? Besoin d'aide ? Envoyez-nous un message.
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-suaps-blue mb-4">
                Informations de contact
              </h3>
              <div className="space-y-3">
                <div className="flex items-center p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-xl mr-3">📧</span>
                  <div>
                    <p className="text-sm font-semibold text-suaps-blue">Email</p>
                    <p className="text-slate-600">suaps@univ-littoral.fr</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-suaps-blue mb-4">
                Localisation
              </h3>
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <iframe
                  width="425"
                  height="350"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=1.877117156982422%2C50.953134703305025%2C1.8820953369140627%2C50.95530757231995&amp;layer=mapnik"
                  className="w-full border-0"
                  title="Université du Littoral Côte d'Opale Location"
                  loading="lazy"
                  style={{ border: '1px solid black' }}
                />
              </div>
            </div>
          </div>
               
          <footer className="mt-12 border-t border-slate-200 pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600">
                © {new Date().getFullYear()} SUAPS • Université du Littoral Côte d'Opale
              </p>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}

function MiniStat({ title, subtitle, icon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-xl font-bold text-suaps-blue">{title}</div>
      <div className="text-xs text-slate-600 mt-1">{subtitle}</div>
    </div>
  );
}

function FeatureRow({ title, text, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500'
  };
  
  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`mt-0.5 h-8 w-8 shrink-0 rounded-lg ${colorClasses[color]} flex items-center justify-center text-white text-sm font-semibold`}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-suaps-blue">{title}</div>
        <div className="mt-1 text-sm text-slate-600">{text}</div>
      </div>
    </div>
  );
}

function Card({ title, text }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-suaps-blue mb-3 flex items-center">
        <span className="text-xl mr-2">{title.split(' ')[0]}</span>
        <span>{title.split(' ').slice(1).join(' ')}</span>
      </h3>
      <p className="text-sm text-slate-600 leading-6">{text}</p>
    </div>
  );
}

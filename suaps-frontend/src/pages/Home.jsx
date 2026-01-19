export default function Home() {
  return (
    <main id="top" className="relative min-h-screen text-white">
      {/* ✅ Fixed background (same theme as login/register) */}
      <div className="fixed inset-0 -z-20 bg-black">
        <img
          src="/basketball-player-action-sunset 1.png"
          alt="Fond sportif"
          className="h-full w-full object-contain object-right"
        />
      </div>

      {/* ✅ Color overlay */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#205187]/80 via-black/70 to-[#E33A3B]/60" />

      {/* ✅ Soft “salt / frosted” layer */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* HERO */}
      <section className="relative">
        {/* optional subtle pattern */}
        <div className="fixed inset-0 -z-20 bg-black pt-16">
  <img
    src="/basketball-player-action-sunset 1.png"
    alt="Fond sportif"
    className="h-full w-full object-contain object-right"
  />
</div>

        <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 md:pt-20 md:pb-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white">
                SUAPS • Université du Littoral Côte d&apos;Opale
              </p>

              <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
                Gérez vos{" "}
                <span className="text-white">activités sportives</span>
                <br />
                <span className="text-white/80">
                  simplement et rapidement
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
                Inscription, validation, suivi des activités et gestion
                administrative — une seule plateforme SUAPS adaptée à chaque
                profil.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-[#E33A3B] px-7 py-3 text-sm font-extrabold text-white hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-[#E33A3B]/25"
                >
                  Créer un compte
                </a>

                <a
                  href="#categories"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-7 py-3 text-sm font-extrabold text-white hover:bg-white/15"
                >
                  Voir les catégories
                </a>
              </div>
            </div>

            {/* Right glass card */}
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-sm backdrop-blur-md sm:p-8">
              <h2 className="text-lg font-extrabold">Fonctionnalités clés</h2>
              <p className="mt-2 text-sm text-white/80">
                Une expérience simple, adaptée à votre rôle.
              </p>

              <div className="mt-6 space-y-3">
                <FeatureRow
                  title="Étudiants"
                  text="Demander une inscription, déposer des documents, suivre les statuts."
                />
                <FeatureRow
                  title="Moniteurs"
                  text="Valider les demandes, gérer les groupes et les évaluations."
                />
                <FeatureRow
                  title="Personnel"
                  text="Participer aux activités dans différents sites."
                />
              </div>

              <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/80">
                Astuce : commencez par créer un compte, puis choisissez une
                activité et envoyez votre demande d’inscription.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-8">
            <h2 className="text-3xl font-black">Catégories</h2>
            <p className="mt-2 text-sm text-white/80">
              Découvrez les activités proposées par le SUAPS.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            <CategoryCard
              img="/soccer-ball-green-grass-soccer-field-generative-ai 1.png"
              title="Football"
            />
            <CategoryCard
              img="/close-up-basketball-outdoors 1.png"
              title="Basketball"
            />
            <CategoryCard
              img="/red-ping-pong-racket-sports-equipment 1.png"
              title="Tennis de table"
            />
            <CategoryCard
              img="/three-white-shuttlecocks-badminton-racquet 1.png"
              title="Badminton"
            />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Contact info */}
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-sm backdrop-blur-md sm:p-8">
              <h2 className="text-3xl font-black">Contact</h2>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Une question ? Besoin d’aide ? Contactez le SUAPS pour toute
                information.
              </p>

              <div className="mt-7 space-y-4">
                <InfoLine label="Email" value="suaps@univ-littoral.fr" />
                <InfoLine
                  label="Localisation"
                  value="Université du Littoral Côte d'Opale"
                />
              </div>

              <div className="mt-8 h-px bg-white/15" />

              <p className="mt-6 text-xs text-white/60">
                © {new Date().getFullYear()} SUAPS • Université du Littoral Côte
                d&apos;Opale
              </p>
            </div>

            {/* Map */}
            <div className="rounded-3xl border border-white/15 bg-white/10 p-3 shadow-sm backdrop-blur-md sm:p-4">
              <div className="overflow-hidden rounded-2xl border border-white/15">
                <iframe
                  width="100%"
                  height="420"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=1.877117156982422%2C50.953134703305025%2C1.8820953369140627%2C50.95530757231995&amp;layer=mapnik"
                  className="w-full border-0"
                  title="Université du Littoral Côte d'Opale"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-xs text-white/60">
                Carte : OpenStreetMap
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-10" />
    </main>
  );
}

/* Small components */
function MiniStat({ title, subtitle }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-sm">
      <div className="text-xl font-black">{title}</div>
      <div className="text-xs text-white/70">{subtitle}</div>
    </div>
  );
}

function FeatureRow({ title, text }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
      <div className="text-sm font-extrabold">{title}</div>
      <div className="mt-1 text-sm text-white/80">{text}</div>
    </div>
  );
}

function CategoryCard({ img, title }) {
  return (
    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-sm">
      <img
        src={img}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="relative flex h-full items-end p-4">
        <div className="w-full">
          <div className="text-lg font-black uppercase tracking-wide">
            {title}
          </div>
          <div className="mt-1 h-1 w-10 rounded-full bg-[#E33A3B]" />
        </div>
      </div>
    </div>
  );
}

function InfoLine({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
      <div className="text-xs font-semibold text-white/70">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

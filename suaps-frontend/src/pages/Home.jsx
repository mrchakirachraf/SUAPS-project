export default function Home() {
  return (
    <main id="top" className="bg-gradient-to-br from-slate-50 to-blue-50">
      {/* HERO */}
      <section className="relative bg-white min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Basketball */}
        <img
          src="/basketball_sport_icon_in_minimalist_3d_render_2 1.png"
          alt="Basketball Background"
          className="absolute inset-0 w-full h-full object-cover opacity-8"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content: Text and Button */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-suaps-blue shadow-sm mb-6">
              • SUAPS • Université du Littoral Côte d&apos;Opale
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
              GÉREZ TOUTES VOS <br className="hidden md:block" />
              ACTIVITÉS <br className="hidden md:block" />
              SPORTIVES
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
              La plateforme complète pour gérer toutes vos activités sportives.
              Inscriptions, validations, suivi des performances et bien plus
              encore.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-start justify-center">
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-gray-800 transition-colors"
              >
                COMMENCER
              </a>

              <a
                href="#about"
                className="inline-flex items-center justify-center rounded-lg border border-suaps-blue/20 bg-white px-6 py-4 text-sm font-semibold text-suaps-blue shadow-sm hover:bg-suaps-blue hover:text-white transition-colors"
              >
                EN SAVOIR PLUS
              </a>
            </div>
          </div>

          {/* Right Content: Basketball Player Image */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <img
              src="/basketball-player-action-sunset 1.png"
              alt="Basketball Player"
              className="max-w-full h-auto lg:max-w-xl xl:max-w-2xl object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-3xl mx-auto text-left mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Catégories
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="relative rounded-xl overflow-hidden shadow-lg group aspect-[4/3]">
              <img
                src="/soccer-ball-green-grass-soccer-field-generative-ai 1.png"
                alt="Football"
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="relative p-4 flex items-end justify-start h-full">
                <h3 className="text-xl font-bold text-white z-10">FOOTBALL</h3>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-lg group aspect-[4/3]">
              <img
                src="/close-up-basketball-outdoors 1.png"
                alt="Basketball"
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="relative p-4 flex items-end justify-start h-full">
                <h3 className="text-xl font-bold text-white z-10">
                  BASKETBALL
                </h3>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-lg group aspect-[4/3]">
              <img
                src="/red-ping-pong-racket-sports-equipment 1.png"
                alt="Tennis de Table"
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="relative p-4 flex items-end justify-start h-full">
                <h3 className="text-xl font-bold text-white z-10">
                  TENNIS DE TABLE
                </h3>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-lg group aspect-[4/3]">
              <img
                src="/three-white-shuttlecocks-badminton-racquet 1.png"
                alt="Badminton"
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="relative p-4 flex items-end justify-start h-full">
                <h3 className="text-xl font-bold text-white z-10">BADMINTON</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="relative bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div id="about" className="relative z-10 mx-auto max-w-6xl px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-white mb-6">CONTACT</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Une question ? Besoin d&apos;aide ? Contactez-nous pour toute
                information sur les activités sportives.
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    Informations de contact
                  </h3>

                  <div className="space-y-6">
                    <div className="flex items-start p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                      <span className="text-2xl mr-4 mt-1">📧</span>
                      <div>
                        <p className="text-lg font-semibold text-white mb-1">
                          Email
                        </p>
                        <p className="text-gray-300">suaps@univ-littoral.fr</p>
                      </div>
                    </div>

                    <div className="flex items-start p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                      <span className="text-2xl mr-4 mt-1">🏫</span>
                      <div>
                        <p className="text-lg font-semibold text-white mb-1">
                          Localisation
                        </p>
                        <p className="text-gray-300">
                          Université du Littoral Côte d&apos;Opale
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <img
                    src="/localisation.svg"
                    alt="Localisation"
                    className="w-8 h-8 mr-3 filter brightness-0 invert"
                  />
                  Localisation
                </h3>

                <div className="rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                  <iframe
                    width="100%"
                    height="400"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=1.877117156982422%2C50.953134703305025%2C1.8820953369140627%2C50.95530757231995&amp;layer=mapnik"
                    className="w-full border-0"
                    title="Université du Littoral Côte d'Opale Location"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-20 pt-12 border-t border-white/20">
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  &copy; {new Date().getFullYear()} SUAPS • Université du Littoral
                  Côte d&apos;Opale
                </p>

                <div className="flex justify-center gap-6 mt-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <img
                      src="/facebook.svg"
                      alt="Facebook"
                      className="w-8 h-8 filter brightness-0 invert"
                    />
                  </a>

                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <img
                      src="/instagram.svg"
                      alt="Instagram"
                      className="w-8 h-8 filter brightness-0 invert"
                    />
                  </a>

                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <img
                      src="/linkedin.svg"
                      alt="LinkedIn"
                      className="w-8 h-8 filter brightness-0 invert"
                    />
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
}

function Card({ title, text }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-suaps-blue mb-3 flex items-center">
        <span className="text-xl mr-2">{title.split(" ")[0]}</span>
        <span>{title.split(" ").slice(1).join(" ")}</span>
      </h3>
      <p className="text-sm text-slate-600 leading-6">{text}</p>
    </div>
  );
}

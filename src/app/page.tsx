
export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-4xl font-bold text-center">
        Bienvenido a la aplicación de Doctoc
      </h1>
      <p className="text-center text-lg max-w-2xl">
        Esta es la página principal de la aplicación. Aquí podrás gestionar doctores y pacientes utilizando las APIs de Doctoc.
      </p>
    </div>
  );
}

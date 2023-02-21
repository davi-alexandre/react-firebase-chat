import './page.scss'


export default function Home() {
  return (
		<>
      <div className="bg-yellow-100 shadow-black shadow-2xl flex content-center items-center justify-center p-3">
        <p className="text-3xl font-bold flex-1 text-center"> Olá NextJs! </p>
        <p className="flex-1 text-right"> Tailwind CSS </p>
      </div>
      <p className="m-7 p-10 bg-black text-white italic">
        (Melhor design de todos os tempos)
      </p>
		</>
  );
}
export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/raio-x-empresarial",
      permanent: false,
    },
  };
}

export default function Home() {
  return null;
}

import Container from "@/components/Common/Container";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="grid place-items-center h-[87vh] bg-gray-900 text-white">
      <Container>
        <h1 className="text-2xl px-5 py-3 rounded w-full font-medium mb-8 bg-primary-blue">
          <Link to="/auth/register">Go to sign up</Link>
        </h1>
      </Container>
    </main>
  );
};

export default Home;

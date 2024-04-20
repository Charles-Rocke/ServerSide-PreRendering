import fs from "fs/promises";
import path from "path";
import Link from "next/link";

function HomePage(props) {
  const { products } = props;
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
}

// this function  will be executed first then the react component function
// This prepares the props data
// fetches and exposes data through props to the component function
// can do server side things
// can use credentials that users shouldn't see
export async function getStaticProps(context) {
  console.log("Re-generating");
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json"); // cwd is treats all files as being in the root directory
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  if (!data) {
    return {
      redirect: {
        destination: "/no-data",
      },
    };
  }
  if (data.products.length === 0) {
    return { notFOund: true };
  }
  return {
    props: {
      products: data.products,
    },
    revalidate: 10,
  };
}
export default HomePage;

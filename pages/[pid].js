import fs from "fs/promises";
import path from "path";

function ProductDetailPage(props) {
  const { loadedProduct } = props;

  // if fallback: true, then do below, else if "blocking" I won't need below
  if (!loadedProduct) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </>
  );
}

async function getData() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json"); // cwd is treats all files as being in the root directory
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  return data;
}

export async function getStaticProps(context) {
  // to pre load data on the server use the params from context // another option is using the params from useRouter but, useRouter will only be done in the browser and not on the server (meaning SEO wont show the data)
  const { params } = context;
  const productId = params.pid; // the '.pid' is the dynamic file route in the pages folder that I created
  const data = await getData();

  const product = data.products.find((product) => product.id === productId);

  if (!product) {
    return { notFound: true };
  }
  return {
    props: {
      loadedProduct: product,
    },
  };
}

// this tells Next that these 3 paths should be pre-generated with the 3 values below (p1, p2, p3)
export async function getStaticPaths() {
  const data = await getData();
  const ids = data.products.map((product) => product.id);
  const pathsWithParams = ids.map((id) => ({ params: { pid: id } }));
  return {
    paths: pathsWithParams,
    fallback: true,
  };
}

export default ProductDetailPage;

import { Stack } from "@ui";
import { Button } from "@repo/ui/components/button";
import { toCurrency } from "@utils";

export default function Page() {
  return (
    <Stack>
      <main className='container-storefront py-8'>
        <p>Storefront app scaffolded. Demo price: {toCurrency(29.99)}</p>
        <Button className='mt-4 bg-primary'>Browse products</Button>
      </main>
    </Stack>
  );
}

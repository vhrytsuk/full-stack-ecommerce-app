import { Stack } from "@ui";
import { toCurrency } from "@utils";

export default function Page() {
  return (
    <Stack>
      <main>Storefront app scaffolded. Demo price: {toCurrency(29.99)}</main>
    </Stack>
  );
}

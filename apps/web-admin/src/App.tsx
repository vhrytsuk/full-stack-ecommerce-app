import { Stack } from "@ui";
import { toCurrency } from "@utils";

export function App() {
  return (
    <Stack>
      <main>Admin app scaffolded. Demo price: {toCurrency(49.99)}</main>
    </Stack>
  );
}

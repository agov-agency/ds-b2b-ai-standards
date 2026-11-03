// One-off, safe to re-run: the Apollo connector uses the new design-system/logos/apollo.svg instead of the list icon.
// Run: npx sanity exec migrations/2026-11-03-apollo-logo.ts --with-user-token
import { getCliClient } from 'sanity/cli';

await getCliClient({ apiVersion: '2025-02-19' }).patch('connector-apollo').set({ brand: 'apollo' }).commit();
console.log('connector-apollo now uses the apollo logo');

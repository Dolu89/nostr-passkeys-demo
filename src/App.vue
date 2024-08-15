<template>
  <h1>Nostr x Passkeys</h1>

  <div>
    <a href="https://github.com/Dolu89/nostr-passkeys-demo">Github</a>
    <p>
      This is a demo of Nostr x Passkeys. It uses Passkeys to authenticate and
      deterministically generate a Nostr account.
    </p>
  </div>

  <h2>Step 1 - Register</h2>
  <button @click="handleRegister">Create a Passkey</button>

  <h2>Step 2 - Login</h2>
  <button @click="handleLogin">Login</button>

  <h3>Infos (login needed)</h3>
  <pre>{{ accountInfos }}</pre>
</template>

<script setup>
import {
  supportsWebAuthn,
  regDefaults,
  register,
  authDefaults,
  auth,
} from "@lo-fi/webauthn-local-client";
import { onMounted } from "vue";
import { privateKeyFromSeedWords } from "nostr-tools/nip06";
import * as nip19 from "nostr-tools/nip19";
import * as bip39 from "@scure/bip39";
import { sha256 } from "@noble/hashes/sha2";
import { hexToBytes } from "@noble/hashes/utils";
import { wordlist } from "@scure/bip39/wordlists/english";
import { getPublicKey } from "nostr-tools/pure";
import { ref } from "vue";

const CHALLENGE = "nostrXpasskeys";

const accountInfos = ref({
  nsec: "",
  npub: "",
  mnemonic: "",
});

async function handleRegister() {
  var regOptions = regDefaults({
    relyingPartyName: "Nostr ❤️ Passkeys",
    user: {
      name: "Nostr account",
    },
  });
  await register(regOptions);
}

async function handleLogin() {
  let authOptions = authDefaults({
    challenge: sha256(CHALLENGE),
  });
  var authResult = await auth(authOptions);

  const mnemonic = bip39.entropyToMnemonic(
    sha256(authResult.response.signature),
    wordlist
  );
  const sk = hexToBytes(privateKeyFromSeedWords(mnemonic));
  const nsec = nip19.nsecEncode(sk);
  const npub = nip19.npubEncode(getPublicKey(sk));

  console.log("mnemonic", mnemonic);
  console.log("sk", sk);
  console.log("nsec", nsec);
  console.log("npub", npub);
  accountInfos.value = { nsec, npub, mnemonic };
}

onMounted(async () => {
  if (!supportsWebAuthn) {
    alert("WebAuthn is not supported. Change browser or enable it.");
    return;
  }
});
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 0.8em;
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
}
</style>

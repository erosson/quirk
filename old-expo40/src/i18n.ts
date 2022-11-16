import * as Localization from "expo-localization";
import { getSetting } from "./setting/settingstore";
import { LOCALE_KEY } from "./setting";
import i18n from "i18n-js";
import en from "./locals/en.json";
import it from "./locals/it.json";
import fr from "./locals/fr.json";
import ko from "./locals/ko.json";
import es from "./locals/es.json";
import de from "./locals/de.json";
import pl from "./locals/pl.json";
import nl from "./locals/nl_NL.json";
import fi from "./locals/fi.json";
import ru from "./locals/ru.json";
import zhHans from "./locals/zh-Hans.json";
import ptPT from "./locals/pt-pt.json";
import ptBR from "./locals/pt-br.json";
import nb from "./locals/nb.json";
import sv from "./locals/sv.json";
import ro from "./locals/ro.json";

function walkReverse(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [
      key,
      typeof val === "string"
        ? val.split("").reverse().join("")
        : walkReverse(val),
    ])
  );
}
i18n.fallbacks = true;
i18n.translations = {
  fr,
  en,
  it,
  ko,
  pl,
  es,
  de,
  fi,
  nl,
  ru,
  "zh-Hans": zhHans,
  "pt-PT": ptPT,
  "pt-BR": ptBR,
  nb,
  sv,
  ro,
  // testing with an obviously-transformed language makes it easy to find and
  // remove hardcoded strings. Hidden behind `feature.testLocalesVisible`.
  _test: walkReverse(en),
};

i18n.locale = Localization.locale;

async function loadLocaleSetting() {
  const locale = await getSetting(LOCALE_KEY);
  if (locale) {
    i18n.locale = locale;
  }
}
loadLocaleSetting();

export default i18n;

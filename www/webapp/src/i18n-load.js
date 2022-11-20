import i18n from "i18n-js"

import en from "../../../expo47/src/locals/en.json";
import it from "../../../expo47/src/locals/it.json";
import fr from "../../../expo47/src/locals/fr.json";
import ko from "../../../expo47/src/locals/ko.json";
import es from "../../../expo47/src/locals/es.json";
import de from "../../../expo47/src/locals/de.json";
import pl from "../../../expo47/src/locals/pl.json";
import nl from "../../../expo47/src/locals/nl_NL.json";
import fi from "../../../expo47/src/locals/fi.json";
import ru from "../../../expo47/src/locals/ru.json";
import zhHans from "../../../expo47/src/locals/zh-Hans.json";
import ptPT from "../../../expo47/src/locals/pt-pt.json";
import ptBR from "../../../expo47/src/locals/pt-br.json";
import nb from "../../../expo47/src/locals/nb.json";
import sv from "../../../expo47/src/locals/sv.json";
import ro from "../../../expo47/src/locals/ro.json";

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
}
i18n.defaultLocale = "en"
i18n.fallbacks = true
export default { translations: Object.keys(i18n.translations) }

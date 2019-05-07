import * as React from 'react';

/* tslint:disable */
const pathDhl = 'M20.45 3.023c-.282.315-.707.945-.99 1.26-.141.19-.425.505.425.505h4.529s.707-.883 1.344-1.638c.85-1.009.07-3.086-2.901-3.086H11.181L9.129 2.52h11.039c.566 0 .566.188.283.503zm-3.325 2.332c-.849 0-.566-.315-.424-.505.282-.315.778-.945 1.061-1.26.283-.315.283-.504-.283-.504h-5.024L8.35 8h9.907c3.255 0 5.095-2.016 5.662-2.645h-6.794zM23.565 8h5.802l2.194-2.645h-5.803c.07 0-2.193 2.645-2.193 2.645zM38.637.064L36.373 2.77h-2.619L36.02.064h-5.803l-3.892 4.724h14.223L44.439.064h-5.802zM31.985 8h5.804l2.193-2.645H34.18c.07 0-2.195 2.645-2.195 2.645zM0 6.425v.567h8.138l.496-.567H0zm9.483-1.07H0v.566h8.987l.496-.566zM0 8h7.219l.495-.566H0V8zm54.912-1.008h8.563v-.567h-8.138l-.425.567zM54.064 8h9.411v-.566h-8.987L54.064 8zm2.193-2.645l-.496.566h7.643v-.566h-7.147zm-7.642-.631L52.507 0H46.35l-3.892 4.724h6.157zm-6.653.63l-.635.756c-.708.882-.072 1.89 2.335 1.89h9.34l2.195-2.645H41.962z';

const pathHermes = 'M13.92 3.123L14.69.5H0l2.54 2.623h11.38zM0 1.176l2.34 1.947h.2L0 .5v.676zM6.19 6.2L3.701 3.633h10.04l-.74 2.566H6.188zm-.179 0l-2.31-1.922v-.644L6.19 6.2h-.178zm4.31 3.223L7.803 6.844h5.006l-.77 2.578H10.32zM7.803 7.487l2.37 1.936h.148l-2.518-2.58v.644zm4.744 1.935h1.424l.754-2.573h-1.424l-.754 2.573zm.963-3.247h1.403l.754-2.53h-1.424l-.733 2.53zm.922-3.064h1.434l.733-2.597h-1.434l-.733 2.597zm45.847 6.224c-.086-.115-.078-.168.156-.96.19-.646.268-.841.345-.853.062-.011.124.031.165.111.102.196.294.275.803.335.647.076 2.24.033 2.51-.068.251-.094.428-.3.503-.586.065-.25.01-.412-.177-.518-.073-.04-.645-.199-1.27-.35-1.257-.303-1.583-.44-1.793-.752-.12-.18-.13-.242-.107-.695.053-1.05.629-2.067 1.353-2.387.453-.202.761-.226 2.798-.226H67.5l-.144.46c-.17.546-.259.71-.431.795-.09.045-.533.071-1.474.089-1.158.02-1.368.037-1.5.113a.693.693 0 0 0-.357.49c-.067.322.076.4 1.316.722 1.537.397 1.831.548 1.973 1.014.14.46-.09 1.645-.45 2.3-.247.451-.522.706-.967.896l-.382.164-2.357.015-2.356.013-.092-.122zm-20.436-.098c0-.032.414-1.47.92-3.194.507-1.725.923-3.19.923-3.257 0-.066-.054-.16-.121-.207-.25-.177-.16-.194.99-.194 1.388 0 1.415.014 1.199.643-.048.145-.078.271-.067.283.014.01.11-.086.217-.214.595-.723.689-.76 1.974-.76.952-.002.984.001 1.285.136.323.141.496.356.607.746l.047.162.315-.41c.475-.617.523-.633 1.829-.634.992 0 1.075.007 1.344.117.156.063.329.16.383.212.163.16.275.449.275.712 0 .155-.296 1.281-.775 2.95-.44 1.533-.76 2.75-.743 2.813a.31.31 0 0 0 .146.164c.264.123.085.148-1.018.148-1.203 0-1.269-.013-1.269-.24 0-.065.31-1.177.686-2.47.377-1.294.685-2.428.685-2.521 0-.363-.359-.531-.996-.469-.609.061-.872.23-1.085.698-.093.207-1.31 4.191-1.377 4.516-.034.157-.017.202.108.303.081.065.132.134.11.152-.02.017-.529.032-1.13.032-1.166 0-1.231-.013-1.231-.243 0-.068.308-1.172.686-2.452.377-1.281.686-2.42.686-2.531 0-.393-.422-.564-1.112-.452-.458.073-.662.19-.84.48-.161.263-1.478 4.542-1.478 4.803 0 .092.043.169.114.208.063.034.114.09.114.125 0 .048-.255.062-1.11.062-.935-.001-1.126-.014-1.201-.08-.05-.042-.09-.104-.09-.137zm-5.832-.005c0-.036.425-1.505.943-3.267.877-2.98.937-3.209.856-3.316-.047-.063-.112-.114-.143-.114-.03 0-.056-.034-.056-.075 0-.063.162-.074 1.107-.074 1.446 0 1.394-.038 1.143.846-.023.08.072.001.267-.224.165-.191.367-.41.447-.485l.146-.137h1.018c.561 0 1.02.014 1.02.033 0 .11-.318 1.055-.385 1.144-.128.172-.337.21-1.246.227-.734.013-.89.03-1.085.119-.411.186-.481.35-1.193 2.732-.359 1.205-.669 2.25-.688 2.324-.025.099.002.17.108.281a.72.72 0 0 1 .143.178c0 .015-.5.03-1.11.03-.934-.001-1.126-.014-1.201-.08-.049-.042-.09-.107-.09-.142zm-17.21-.791c.852-2.812 2.131-7.21 2.135-7.344.005-.117-.03-.195-.119-.257-.07-.05-.127-.125-.127-.168 0-.069.144-.079 1.226-.079 1.07 0 1.237.011 1.321.084.132.115.105.25-.363 1.817-.219.731-.384 1.341-.366 1.356.018.016.696.028 1.51.028h1.479l.054-.112c.072-.146.73-2.364.775-2.61.029-.162.012-.208-.112-.31-.297-.242-.252-.253 1.098-.253 1.348 0 1.382.007 1.382.266 0 .119-.704 2.578-1.4 4.885-.814 2.7-.95 3.223-.885 3.361.037.077.103.153.147.167.044.015.081.062.081.103 0 .066-.165.076-1.246.076-1.345 0-1.384-.006-1.384-.262 0-.08.245-.963.543-1.964.299-1.002.543-1.85.543-1.887 0-.054-.288-.067-1.53-.067h-1.529l-.531 1.83c-.292 1.006-.53 1.87-.528 1.918 0 .05.06.14.133.204.072.063.12.14.11.172-.031.084-2.421.081-2.517-.001-.108-.095-.08-.355.1-.953zm41.327-3.65c.206-.892-.15-1.24-1.224-1.194-.84.037-1.249.34-1.575 1.168-.06.15-.109.282-.109.291 0 .01.641.017 1.423.017h1.42l.065-.282zm-5.366 3.843l-.2-.341v-.751c0-.606.026-.853.135-1.274.34-1.328.916-2.469 1.532-3.037.708-.654 1.552-.902 3.078-.907 1.512-.006 2.194.255 2.527.964.153.325.137 1.313-.031 1.904-.16.563-.306.85-.476.935-.102.05-.643.072-2.306.091l-2.173.024-.102.348c-.137.462-.146.855-.025 1.053.059.096.2.201.37.274.25.108.342.116 1.158.116 1.214-.001 1.76-.127 2.249-.52.224-.18.38-.25.38-.173 0 .096-.471 1.545-.54 1.661-.231.388-.846.502-2.68.499-1.116-.002-1.39-.018-1.744-.098-.591-.135-.9-.342-1.152-.768zM32.003 4.886c.161-.56.122-.846-.149-1.068-.406-.334-1.464-.316-1.988.032-.233.156-.455.471-.637.906l-.131.316h2.851l.054-.186zm-5.405 3.647c-.152-.283-.16-.335-.155-.971.003-.492.039-.812.13-1.195.297-1.21.934-2.548 1.462-3.07.592-.585 1.378-.88 2.57-.964 1.153-.081 2.117.048 2.59.345.482.305.644.66.644 1.411 0 .548-.162 1.356-.35 1.737-.196.394-.173.391-2.614.391h-2.12l-.057.187c-.266.876-.22 1.248.18 1.476.291.164 1.314.226 2.137.126.615-.075 1.027-.221 1.34-.476.443-.36.47-.314.25.41-.359 1.185-.425 1.28-1.012 1.446-.407.116-3.142.149-3.676.045-.678-.133-1.041-.38-1.319-.898z';

/* tslint:enable */
export const PartnerIconDhl: React.SFC = () => (
    <svg width="64" height="8" viewBox="0 0 64 8">
        <path fill="#111" fillRule="evenodd" d={ pathDhl } opacity=".497" />
    </svg>
);

export const PartnerIconHermes: React.SFC = () => (
    <svg width="68" height="10" viewBox="0 0 68 10">
        <path fill="#111" fillRule="evenodd" d={ pathHermes } opacity=".497" />
    </svg>
);
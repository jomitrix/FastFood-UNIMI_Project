import React from "react";

const Eye = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const EyeClosed = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
);

const Profile = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const Login = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
    </svg>
);

const Logout = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
);

const Restaurant = ({ size = 24, width, height, ...props }) => (
    <svg
        viewBox="0 -1 511.99871 511"
        xmlns="http://www.w3.org/2000/svg"
        width={width || size}
        height={height || size}
        {...props}
    >
        <path d="m380.589844 204.039062 30.082031-1.90625c.050781-.003906.105469-.007812.160156-.011718 21.4375-1.808594 40.679688-13.039063 52.796875-30.820313l23.78125-34.890625c20.699219-30.375 28.71875-67.0625 22.574219-103.300781-1.207031-7.117187-4.847656-13.675781-10.246094-18.460937-5.402343-4.789063-12.347656-7.617188-19.558593-7.960938-36.726563-1.757812-72.175782 10.605469-99.847657 34.796875l-31.789062 27.792969c-16.199219 14.160156-25.042969 34.609375-24.269531 56.113281.003906.050781.003906.105469.007812.160156l1.714844 30.089844c.667968 11.730469-3.632813 23.304687-11.777344 31.734375l-248.351562 255.132812c-6.648438 6.933594-10.082032 16.445313-9.664063 26.785157.460937 11.382812 5.683594 22.5625 13.972656 29.910156 7.488281 6.636719 17.78125 10.417969 28.070313 10.417969 1.101562 0 2.203125-.042969 3.300781-.132813 10.316406-.824219 19.351563-5.371093 25.46875-12.847656l223.464844-277.085937c7.410156-9.117188 18.386719-14.773438 30.109375-15.515626zm-42.039063 5.859376-223.445312 277.0625c-3.414063 4.171874-8.664063 6.742187-14.78125 7.230468-7.277344.582032-14.738281-1.839844-19.964844-6.472656-5.226563-4.636719-8.523437-11.753906-8.816406-19.046875-.25-6.128906 1.667969-11.648437 5.363281-15.5l248.332031-255.113281c11.132813-11.519532 16.992188-27.296875 16.085938-43.289063l-1.714844-30.011719c-.582031-16.832031 6.351563-32.835937 19.035156-43.925781l31.789063-27.792969c24.671875-21.566406 56.289062-32.578124 89.015625-31.023437 3.726562.179687 7.3125 1.640625 10.105469 4.117187 2.792968 2.472657 4.671874 5.863282 5.296874 9.539063 5.476563 32.308594-1.671874 65.011719-20.125 92.089844l-23.78125 34.894531c-9.488281 13.921875-24.546874 22.722656-41.328124 24.164062l-30 1.898438c-15.984376 1.015625-30.945313 8.726562-41.066407 21.179688zm0 0"/>
        <path d="m497.820312 440.570312-166.519531-151.667968c-3.132812-2.855469-7.984375-2.628906-10.84375.503906-2.851562 3.132812-2.625 7.988281.507813 10.84375l166.476562 151.632812c3.960938 3.660157 6.207032 9.054688 6.328125 15.1875.144531 7.296876-2.71875 14.597657-7.660156 19.539063-4.9375 4.9375-12.226563 7.808594-19.539063 7.660156-6.132812-.121093-11.527343-2.367187-15.148437-6.285156l-148.382813-162.90625c-2.855468-3.136719-7.710937-3.359375-10.84375-.507813-3.132812 2.855469-3.359374 7.710938-.503906 10.84375l148.417969 162.945313c6.523437 7.054687 15.8125 11.054687 26.160156 11.257813.269531.003906.535157.007812.804688.007812 11.121093 0 22.242187-4.511719 29.886719-12.160156 7.835937-7.835938 12.378906-19.308594 12.152343-30.695313-.203125-10.347656-4.199219-19.636719-11.292969-26.199219zm0 0"/>
        <path d="m92.609375 202.585938c12.703125 11.703124 29.207031 18.375 46.472656 18.789062.054688.003906.109375.003906.160157.003906l30.140624.09375c11.75.035156 23.042969 5.023438 30.96875 13.660156l13.277344 14.574219c1.515625 1.664063 3.589844 2.507813 5.675782 2.507813 1.84375 0 3.695312-.660156 5.164062-2 3.136719-2.855469 3.363281-7.710938.507812-10.84375l-13.296874-14.59375c-10.828126-11.804688-26.226563-18.601563-42.246094-18.65625l-30.058594-.09375c-13.355469-.339844-26.125-5.453125-36.019531-14.410156l-87.347657-103.835938c-.890624-1.0625-.824218-2.601562.15625-3.582031.671876-.675781 1.460938-.773438 1.871094-.773438s1.199219.097657 1.875.773438l79.507813 79.511719c7.859375 7.859374 20.648437 7.859374 28.507812-.003907l9.34375-9.339843v-.003907l16.589844-16.589843s.003906 0 .003906-.003907c0 0 .003907-.003906.003907-.003906l9.339843-9.339844c7.859375-7.859375 7.859375-20.648437 0-28.507812l-79.507812-79.507813c-1.03125-1.03125-1.03125-2.714844 0-3.746094.980469-.980468 2.519531-1.046874 3.582031-.15625l103.835938 87.351563c8.960937 9.890625 14.074218 22.664063 14.414062 36.015625l.089844 30.0625c.054687 16.015625 6.855468 31.414062 18.675781 42.265625l14.226563 12.957031c3.136718 2.855469 7.988281 2.628906 10.84375-.503906 2.851562-3.136719 2.625-7.988281-.507813-10.84375l-14.203125-12.9375c-8.660156-7.945312-13.644531-19.242188-13.683594-30.988281l-.09375-30.140625c0-.054688 0-.109375-.003906-.164063-.414062-17.265625-7.085938-33.769531-18.789062-46.472656-.21875-.238281-.453126-.464844-.703126-.675781l-104.222656-87.671875c-7.203125-6.0625-17.65625-5.609375-24.3125 1.046875-7.019531 7.019531-7.019531 18.4375 0 25.453125l79.507813 79.511719c1.875 1.875 1.875 4.925781 0 6.800781l-3.917969 3.914062-88.613281-88.609375c-2.996094-3-7.855469-3-10.851563 0-2.996094 2.996094-2.996094 7.855469 0 10.851563l88.613282 88.613281-5.742188 5.738281-88.613281-88.609375c-2.996094-2.996094-7.855469-2.996094-10.851563 0-3 2.996094-3 7.855469 0 10.851563l88.609375 88.613281-3.914062 3.917969c-1.875 1.875-4.925781 1.875-6.800781 0l-79.511719-79.507813c-3.398438-3.398437-7.917969-5.273438-12.726563-5.273438s-9.328125 1.875-12.726562 5.273438c-6.65625 6.65625-7.105469 17.109375-1.046875 24.316406l87.675781 104.21875c.207031.25.433594.484376.671875.703126zm0 0"/>
    </svg>
);

const Search = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2.25-4.5a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z" />
    </svg>
);

const Home = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

const Email = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
);

const Handle = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
    </svg>
);

const Storefront = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
    </svg>
);

const ChevronRight = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);

const Dashboard = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
);

const Takeaway = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path d="M23.484 9.125a.997.997 0 0 0-1.016.028l-.657.412a5.24 5.24 0 0 0 .188-1.315c0-1.331-.514-2.534-1.333-3.461a6.708 6.708 0 0 0 1.091-.335c1.037-.421 1.735-1.348 2.134-2.04a.81.81 0 0 0-.482-1.185c-.769-.218-1.915-.394-2.952.027-.912.371-1.692 1.232-2.236 1.979a5.192 5.192 0 0 0-1.471-.236c-2.108 0-3.918 1.257-4.752 3.053l-.573-1.3A4.97 4.97 0 0 1 11 2.735v-.736a1 1 0 1 0 0-2H4a1 1 0 1 0 0 2v.736c0 .698-.143 1.377-.425 2.017l-.896 2.033a7.927 7.927 0 0 0-.652 2.679l-.497-.312a1 1 0 0 0-1.532.847v9.5c0 2.481 2.019 4.5 4.5 4.5h15c2.481 0 4.5-2.019 4.5-4.5v-9.5a.998.998 0 0 0-.516-.875ZM16.75 5A3.254 3.254 0 0 1 20 8.25c0 .638-.197 1.253-.544 1.78l-1.416-.88a.998.998 0 0 0-1.055 0l-2.229 1.385-.66-.41a3.224 3.224 0 0 1-.597-1.875A3.254 3.254 0 0 1 16.749 5ZM4.51 7.593l.896-2.033a6.956 6.956 0 0 0 .595-2.823v-.736h3v.736c0 .978.2 1.927.595 2.823l.896 2.033c.263.597.422 1.224.481 1.869l-1.729 1.074-2.229-1.385a.998.998 0 0 0-1.055 0L4 10.369v-.356c0-.839.172-1.653.51-2.42ZM2 19.5v-7.692l1.199.752a.997.997 0 0 0 1.059.003l2.229-1.385 2.229 1.384a.998.998 0 0 0 1.055 0L12 11.177l2 1.242V19.5c0 .925.282 1.784.762 2.5H4.5A2.502 2.502 0 0 1 2 19.5Zm20 0c0 1.379-1.121 2.5-2.5 2.5h-1a2.502 2.502 0 0 1-2.5-2.5v-7.383l1.513-.939 2.229 1.385a.993.993 0 0 0 1.059-.003L22 11.808V19.5Z" />
    </svg>
);

const Delivery = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path d="M8 2.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zM0 10V8c0-.366.106-.705.278-1A1.978 1.978 0 0 1 0 6V4c0-1.103.897-2 2-2h2c1.103 0 2 .897 2 2v2c0 .366-.106.705-.278 1 .172.295.278.634.278 1v2c0 1.103-.897 2-2 2H2c-1.103 0-2-.897-2-2zm4-2H2v2h2zM2 6h2V4H2zm22 14.5c0 1.93-1.57 3.5-3.5 3.5a3.495 3.495 0 0 1-3.149-2H12a1 1 0 1 1 0-2h1v-2.275a.998.998 0 0 0-.545-.891l-2.828-1.443A2.992 2.992 0 0 1 8 12.724V8.447c0-.716.283-1.358.799-1.809.631-.552 1.661-.822 2.572-.566l4.821 1.929h1.655c1.131 0 2.124.763 2.415 1.856l1.399 5.247c.193.726.268 1.453.281 2.218a3.5 3.5 0 0 1 2.057 3.18zm-13.459-6.888.459.234V8.077l-.241-.096c-.271-.015-.511.045-.644.162-.058.05-.115.125-.115.303v4.277c0 .375.207.716.541.889zM15 17.725V20h2.051a3.49 3.49 0 0 1 2.89-2.943 7.022 7.022 0 0 0-.211-1.439l-1.398-5.246a.5.5 0 0 0-.483-.371h-1.848c-.127 0-.253-.024-.371-.071l-2.629-1.052v5.99l.364.186a2.987 2.987 0 0 1 1.636 2.672zm7 2.775c0-.827-.673-1.5-1.5-1.5s-1.5.673-1.5 1.5.673 1.5 1.5 1.5 1.5-.673 1.5-1.5zM8.361 17.226c.396.67.639 1.441.639 2.274C9 21.981 6.981 24 4.5 24S0 21.981 0 19.5c0-1.421.675-2.675 1.706-3.5H1a1 1 0 1 1 0-2h3.658c1.018 0 1.956.509 2.513 1.361 0 0 1.173 1.795 1.19 1.865zM7 19.5c0-.51-.155-.984-.419-1.38l-.017-.027A2.498 2.498 0 0 0 2 19.5C2 20.878 3.121 22 4.5 22S7 20.878 7 19.5z" />
    </svg>
);

const Hamburger = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const Orders = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

const Meals = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path fillRule="evenodd" clipRule="evenodd" d="M20 18H4C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18ZM4 16C2.89543 16 2 16.8954 2 18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18C22 16.8954 21.1046 16 20 16H4Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M14.655 6.39803C14.8753 5.98056 15 5.50484 15 5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5C9 5.50484 9.1247 5.98056 9.34498 6.39803C5.67037 7.53089 3 10.9536 3 15V17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17V15C21 10.9536 18.3296 7.53089 14.655 6.39803ZM13 5C13 5.55228 12.5523 6 12 6C11.4477 6 11 5.55228 11 5C11 4.44772 11.4477 4 12 4C12.5523 4 13 4.44772 13 5ZM12 8C8.13401 8 5 11.134 5 15V16H19V15C19 11.134 15.866 8 12 8Z" />
    </svg>
);

const Phone = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
);

const Briefcase = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
    </svg>
);

const MapPin = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

const MoveUp = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
    </svg>
);

const MoveDown = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
    </svg>
);

const Edit = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

const Draggable = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
    </svg>
);

const Plus = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const ChefHat = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path fillRule="evenodd" clipRule="evenodd" d="M17 4C16.6803 4 16.3676 4.03001 16.0645 4.08737C15.1571 2.82336 13.6747 2 12 2C10.3253 2 8.84287 2.82336 7.93548 4.08736C7.63244 4.03001 7.31972 4 7 4C4.23858 4 2 6.23858 2 9C2 11.0503 3.2341 12.8124 5 13.584V19C5 20.6569 6.34315 22 8 22H16C17.6569 22 19 20.6569 19 19V13.584C20.7659 12.8124 22 11.0503 22 9C22 6.23858 19.7614 4 17 4ZM14.4398 5.2537L15.1835 6.28962L16.4365 6.05248C16.6175 6.01821 16.8057 6 17 6C18.6569 6 20 7.34315 20 9C20 10.2271 19.263 11.2865 18.1993 11.7513L17 12.2752V16H7V12.2752L5.80074 11.7513C4.73702 11.2865 4 10.2271 4 9C4 7.34315 5.34315 6 7 6C7.19431 6 7.38251 6.01821 7.56355 6.05248L8.81652 6.28962L9.56018 5.25369C10.108 4.49053 10.9967 4 12 4C13.0033 4 13.892 4.49053 14.4398 5.2537ZM7 18V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V18H7Z" />
    </svg>
);

const Pizza = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path fillRule="evenodd" clipRule="evenodd" d="M9.37213 3.77885L2.81031 15.7094C1.73827 17.6586 2.17759 20.0428 4.26831 20.8027C6.01942 21.4391 8.54308 21.9995 12.0008 21.9995C15.4585 21.9995 17.9821 21.4391 19.7333 20.8027C21.824 20.0428 22.2633 17.6586 21.1913 15.7094L14.6294 3.77885C13.4896 1.70653 10.5119 1.70653 9.37213 3.77885ZM5.50836 14.954L11.1246 4.74269C11.5045 4.05191 12.4971 4.05192 12.877 4.74269L18.4931 14.9539C18.4116 14.9965 18.3207 15.0406 18.2195 15.0856C17.2643 15.5101 15.4154 15.9994 12.0006 15.9994C8.58587 15.9994 6.73695 15.5101 5.78178 15.0856C5.68071 15.0407 5.58986 14.9966 5.50836 14.954ZM19.4569 16.7067C19.3264 16.776 19.185 16.8451 19.0318 16.9132C17.7369 17.4887 15.5859 17.9994 12.0006 17.9994C8.41542 17.9994 6.26434 17.4887 4.9695 16.9132C4.81639 16.8452 4.67504 16.7761 4.5446 16.7068C4.23721 17.2836 4.19668 17.8351 4.29184 18.2102C4.37534 18.5392 4.56293 18.7818 4.95146 18.923C6.47202 19.4756 8.76343 19.9995 12.0008 19.9995C15.2381 19.9995 17.5295 19.4756 19.0501 18.923C19.4386 18.7818 19.6262 18.5392 19.7097 18.2102C19.8049 17.8351 19.7643 17.2835 19.4569 16.7067Z" />
        <path d="M16.7804 11.8413L17.7468 13.5983C16.8422 14.0374 15.8033 14.1205 14.8376 13.8272C13.8225 13.5189 12.9715 12.82 12.4717 11.8843C11.9719 10.9485 11.8643 9.85254 12.1726 8.83745C12.4564 7.90328 13.0709 7.10804 13.8964 6.59766L14.8628 8.35465C14.4931 8.61018 14.2182 8.9844 14.0863 9.41866C13.9322 9.9262 13.986 10.4742 14.2359 10.9421C14.4857 11.41 14.9113 11.7594 15.4188 11.9136C15.8689 12.0503 16.3508 12.0234 16.7804 11.8413Z" />
        <path d="M11 13C11 13.5523 10.5523 14 10 14C9.44772 14 9 13.5523 9 13C9 12.4477 9.44772 12 10 12C10.5523 12 11 12.4477 11 13Z" />
    </svg>
);

const Upload = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);

const Flag = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path d="M4 1C4 0.447716 4.44772 0 5 0C5.55228 0 6 0.447715 6 1V23C6 23.5523 5.55228 24 5 24C4.44772 24 4 23.5523 4 23V1Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M11.1707 14H4V2H10C11.3062 2 12.4175 2.83481 12.8293 4H17.7639C19.2507 4 20.2177 5.56463 19.5528 6.89443L18 10L19.5528 13.1056C20.2177 14.4354 19.2507 16 17.7639 16H14C12.6938 16 11.5825 15.1652 11.1707 14ZM6 4H10C10.5523 4 11 4.44772 11 5V12H6V4ZM13 13C13 13.5523 13.4477 14 14 14H17.7639L15.7639 10L17.7639 6H13V13Z" />
    </svg>
);

const ForkKnife = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path fillRule="evenodd" clipRule="evenodd" d="M17 2C19.7614 2 22 4.23858 22 7V14C22 14.4589 21.6877 14.8589 21.2425 14.9701L18 15.7808V21C18 21.5523 17.5523 22 17 22C16.4477 22 16 21.5523 16 21V3C16 2.44772 16.4477 2 17 2ZM18 13.7192L20 13.2192V7C20 5.69378 19.1652 4.58254 18 4.17071V13.7192Z" />
        <path d="M4 3C4 2.44772 3.55228 2 3 2C2.44772 2 2 2.44772 2 3V7C2 9.41896 3.71776 11.4367 6 11.9V21C6 21.5523 6.44772 22 7 22C7.55228 22 8 21.5523 8 21V11.9C10.2822 11.4367 12 9.41896 12 7V3C12 2.44772 11.5523 2 11 2C10.4477 2 10 2.44772 10 3V7C10 8.30622 9.16519 9.41746 8 9.82929V3C8 2.44772 7.55228 2 7 2C6.44772 2 6 2.44772 6 3V9.82929C4.83481 9.41746 4 8.30622 4 7V3Z" />
    </svg>
);

const ExclShield = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
    </svg>
);

const Points = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
);

const CreditCard = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" 
        />
    </svg>
);

const Funnel = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" 
        />
    </svg>
);

const Star = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" 
        />
    </svg>
);

const CheckMark = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

const Time = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const Info = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);

const Cart = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
);

const Trash = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const X = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Delete = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="currentColor" 
        viewBox="0 0 20 20" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const Cash = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
    </svg>
);

const Notes = ({ size = 24, width, height, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        width={width || size}
        height={height || size}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

export { Eye, EyeClosed, Profile, Login, Logout, Restaurant, Search, Home, Email, Handle,
    Storefront, ChevronRight, Dashboard, Takeaway, Delivery, Hamburger, Orders,
    Meals, Phone, Briefcase, MapPin, MoveUp, MoveDown, Edit, Draggable, Plus,
    ChefHat, Pizza, Upload, Flag, ForkKnife, ExclShield, Points, CreditCard,
    Funnel, Star, CheckMark, Time, Info, Cart, Trash, X, Delete, Cash, Notes };
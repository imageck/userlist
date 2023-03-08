import { useEffect, useState } from "react";
import useAxios from "axios-hooks";
import { useAuth0 } from "@auth0/auth0-react";

export default function Buttons({ ids, setIds, toast, refetch, page }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(ids.length);
  }, [ids.length]);
  const actions = ["Block", "Unblock", "Delete"];
  let buttons = [];
  actions.forEach(action => {
    buttons.push(
      <li key={action} className="btn-group">
        <Button action={action} ids={ids} count={count} setCount={setCount} toast={toast} refetch={refetch} page={page} />
      </li>
    )
  });

  return (
    <menu className="btn-toolbar gap-2 p-0" role="toolbar" aria-label="User controls">
      {buttons}
    </menu>
  );
}

function Button({ action, ids, count, setCount, toast, refetch, page }) {
  const [{ loading }, req] = useAxios();

  let className = "btn ";
  switch (action) {
    case "Block":
      className += "btn-danger";
      break;
    case "Unblock":
      className += "btn-outline-success px-1";
      break;
    case "Delete":
      className += "btn-outline-danger px-1";
      break;
    default:
      break;
  }

  const { getAccessTokenSilently, isAuthenticated, logout, user } = useAuth0();
  async function handleClick(e) {
    const domain = process.env.REACT_APP_AUTH0_DOMAIN;
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        },
      });

      const userApi = `https://${domain}/api/v2/users/${user.sub}`;

      const res = await fetch(userApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 404) {
        logout({ returnTo: window.location.origin });
        return;
      }
      const { blocked } = await res.json();
      if (blocked || !isAuthenticated) {
        logout({ returnTo: window.location.origin });
        return;
      }
      setCount(0);
      let config = {};
      switch (action) {
        case "Block": case "Unblock":
          config.method = "PATCH";
          config.data = { userIds: ids, blocked: action === "Block" };
          break;
        case "Delete":
          config.method = "DELETE";
          config.data = ids;
          break;
        default:
          break;
      }
      try {
        await req(config);
        if (action !== "Unblock" && ids.includes(user.sub)) {
          logout({ returnTo: window.location.origin });
          return;
        } else {
          refetch({ params: { page } });
        }
      } catch(err) {
          toast.show();
          setCount(ids.length);
      }
    } catch(err) {
      toast.show();
      setCount(ids.lengt);
    }
  }

  return (
    <button type="button"
            className={className}
            disabled={!count}
            onClick={handleClick}
            title={action + " the selected user" + (count > 1 ? 's' : '')}>
      {action === "Block" ? <Block />
      : "Unblock" ? <Unblock />
      : "Delete" ? <Delete />
      : null}
      {loading ? (<>
        <span className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true">
        </span>
        <span class="visually-hidden">Loading...</span>
      </>) : (
      <span className={action !== "Block" ? "visually-hidden" : undefined}>
        {action}
      </span>
      )}
    </button>
  );
}

function Icon({ props, children }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={36}
      height={24}
      fill="currentColor"
      className="bi"
      viewBox="0 0 16 16"
      {...props}
    >
      {children}
    </svg>
  )
}

function Block() {
  return (
    <Icon>
      <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM8 7a2 2 0 100-4 2 2 0 000 4zm0 5.996V14H3s-1 0-1-1 1-4 6-4c.564 0 1.077.038 1.544.107a4.524 4.524 0 00-.803.918A10.46 10.46 0 008 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h5zM9 13a1 1 0 011-1v-1a2 2 0 114 0v1a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2zm3-3a1 1 0 00-1 1v1h2v-1a1 1 0 00-1-1z" />
    </Icon>
  );
}

function Unblock() {
  return (
    <Icon>
      <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z" />
    </Icon>
  );
}

function Delete() {
  return (
    <Icon>
      <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z" />
      <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708Z" />
    </Icon>
  );
}

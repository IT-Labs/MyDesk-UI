import { useLocation, useNavigate, useParams } from "react-router";

/**
 * It takes a component as an argument and returns a new component that has the same props as the
 * original component, but also has the location, navigate, and params objects from the
 * react-router-dom library
 * @param Child - The component you want to wrap with the router.
 * @returns A function that takes a component as an argument and returns a component.
 */
export function withRouter(Child) {
  return (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    return (
      <Child
        {...props}
        navigate={navigate}
        location={location}
        params={params}
      />
    );
  };
}

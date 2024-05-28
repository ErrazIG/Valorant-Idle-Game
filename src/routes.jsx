import App from "./App";
import GuessAgentPage from "./pages/guess-agent/guess-agent";
import HomePage from "./pages/home/home.page";

export const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/guess-agent",
        element: <GuessAgentPage />,
      },
    ],
  },
];

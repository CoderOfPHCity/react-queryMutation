import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import useVotesError from "./useVotesError";
import "./style.css";

const fetchVotes = async () => {
  // Simulate fetching vote count from the server
  const response = await fetch("https://jsonplaceholder.typicode.com/users/");
  if (!response.ok) {
    throw new Error("Failed to fetch votes");
  }
  const data = await response.json();
  return { count: data.length }; // Use the number of users as the vote count for simulation
};

const Counter = () => {
  const [localVotes, setLocalVotes] = useState({ male: 0, female: 0 });
  const queryClient = useQueryClient();
  const { error, handleVoteError, clearError } = useVotesError();

  const { data, isLoading } = useQuery("votes", fetchVotes);

  const voteMutation = useMutation(
    (type) => {
      // Simulate updating vote count on the server (in this case, the client-side)
      if (type === "male") {
        setLocalVotes((prevVotes) => ({
          ...prevVotes,
          male: prevVotes.male + 1
        }));
      } else if (type === "female") {
        setLocalVotes((prevVotes) => ({
          ...prevVotes,
          female: prevVotes.female + 1
        }));
      }
    },
    {
      onError: (error) => {
        handleVoteError(error);
      }
    }
  );

  const deleteVotesMutation = useMutation(
    () => {
      // Simulate deleting votes on the server (in this case, the client-side)
      setLocalVotes({ male: 0, female: 0 });
    },
    {
      onError: (error) => {
        handleVoteError(error);
      }
    }
  );

  const handleVote = (type) => {
    voteMutation.mutate(type);
  };

  const handleDeleteVotes = () => {
    deleteVotesMutation.mutate();
  };

  const handleInvalidateAndRefetch = () => {
    queryClient.invalidateQueries("votes", { refetchActive: true });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={clearError}>Dismiss</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Votes Counter</h1>
      <p>Max Votes: {data.count}</p>
      <p>Male Votes: {localVotes.male}</p>
      <p>Female Votes: {localVotes.female}</p>
      <button onClick={() => handleVote("male")}>Vote for Male</button>
      <button onClick={() => handleVote("female")}>Vote for Female</button>
      <button onClick={handleDeleteVotes}>Delete Votes</button>
      {error && (
        <div>
          <p>Error: {error.message}</p>
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default Counter;

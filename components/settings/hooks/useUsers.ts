'use client'

import { UsersResponse, UserUI } from "@/types/type-ui";
import { useState, useEffect, useCallback } from "react";

const USERS_API_URL = "/api/users";

export function useUsers() {
  const [users, setUsers] = useState<UserUI[]>([]);
  const [loading, setLoading] = useState(true);



  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${USERS_API_URL}`);
      if (response.ok) {
        const data:UsersResponse = await response.json();
        setUsers(data.users);
      } else {
        console.error("Failed to fetch users");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  
    

  return { users, loading, refetch: fetchUsers };
}


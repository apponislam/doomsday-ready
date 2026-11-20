import React from "react";
import { Icon } from "@/components/icons/icon";

interface UserProfileProps {
    initials?: string;
    name?: string;
    role?: string;
}

export function UserProfile({ initials = "AR", name = "Alex Rivera", role = "Earth-616 Fan" }: UserProfileProps) {
    return (
        <div className="profile">
            <span>{initials}</span>
            <div>
                <strong>{name}</strong>
                <small>{role}</small>
            </div>
            <Icon name="chevron" size={15} />
        </div>
    );
}

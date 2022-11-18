import React from "react";

export function useAsyncEffect(asyncEffect: () => Promise<void>): void {
    React.useEffect(() => {
        asyncEffect()
    })
}
'use client'

export default function PageError({
    error,
}: {
    error: Error & { digest?: string }
}) {
    const handleRetry = () => {
        window.location.reload()
    }

    return (
        <div className="error_page">
            <div className="container">
                <div className="error_state">
                    <h4 className="heading">{error.message}</h4>
                    <button className="btn" onClick={handleRetry}>Try again</button>
                </div>
            </div>
        </div>
    )
}
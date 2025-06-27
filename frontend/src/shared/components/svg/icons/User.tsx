const UserSvg = ({ size = 25 }: { size?: number }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M8 9C9.38071 9 10.5 7.88071 10.5 6.5C10.5 5.11929 9.38071 4 8 4C6.61929 4 5.5 5.11929 5.5 6.5C5.5 7.88071 6.61929 9 8 9Z" fill="#000000"/>
            <path d="M6 10C4.80291 10 3.76957 10.7012 3.28827 11.7152C4.43733 13.1315 6.12717 14 8 14C9.87283 14 11.5627 13.1315 12.7117 11.7152C12.2304 10.7012 11.1971 10 10 10H6Z" fill="#000000"/>
        </svg>
    )
}

export default UserSvg
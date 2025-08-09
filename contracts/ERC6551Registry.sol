// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/Create2.sol";

/**
 * @title ERC6551Registry
 * @dev Registry for creating Token Bound Accounts (ERC-6551)
 * @custom:security-contact ferreiracavazin@gmail.com
 */
contract ERC6551Registry {
    
    event ERC6551AccountCreated(
        address account,
        address indexed implementation,
        bytes32 salt,
        uint256 chainId,
        address indexed tokenContract,
        uint256 indexed tokenId
    );

    error AccountCreationFailed();

    /**
     * @dev Creates a token bound account for a given token
     * @param implementation The implementation address for the account
     * @param chainId The chain ID
     * @param tokenContract The token contract address
     * @param tokenId The token ID
     * @param salt Salt for deterministic address generation
     */
    function createAccount(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        bytes32 salt
    ) external returns (address) {
        bytes memory code = _creationCode(implementation, chainId, tokenContract, tokenId);
        
        address account = Create2.computeAddress(salt, keccak256(code));
        
        if (account.code.length != 0) {
            return account;
        }

        account = Create2.deploy(0, salt, code);
        
        if (account == address(0)) {
            revert AccountCreationFailed();
        }

        emit ERC6551AccountCreated(
            account,
            implementation,
            salt,
            chainId,
            tokenContract,
            tokenId
        );

        return account;
    }

    /**
     * @dev Computes the address of a token bound account
     * @param implementation The implementation address for the account
     * @param chainId The chain ID
     * @param tokenContract The token contract address
     * @param tokenId The token ID
     * @param salt Salt for deterministic address generation
     */
    function account(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        bytes32 salt
    ) external view returns (address) {
        bytes memory code = _creationCode(implementation, chainId, tokenContract, tokenId);
        return Create2.computeAddress(salt, keccak256(code));
    }

    /**
     * @dev Returns the creation code for a token bound account
     * @param implementation The implementation address for the account
     * @param chainId The chain ID
     * @param tokenContract The token contract address
     * @param tokenId The token ID
     */
    function _creationCode(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) internal pure returns (bytes memory) {
        return abi.encodePacked(
            hex"3d60ad80600a3d3981f3363d3d373d3d3d363d73",
            implementation,
            hex"5af43d82803e903d91602b57fd5bf3",
            abi.encode(salt, chainId, tokenContract, tokenId)
        );
    }

    function salt() internal pure returns (bytes32) {
        return 0x6551655165516551655165516551655165516551655165516551655165516551;
    }
}
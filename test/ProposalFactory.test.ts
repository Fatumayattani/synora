import { expect } from "chai";
import { ethers } from "hardhat";
import { ProposalFactory } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("ProposalFactory", function () {
  let proposalFactory: ProposalFactory;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const ProposalFactory = await ethers.getContractFactory("ProposalFactory");
    proposalFactory = await ProposalFactory.deploy();
    await proposalFactory.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await proposalFactory.getAddress()).to.be.properAddress;
    });

    it("Should start with zero proposals", async function () {
      expect(await proposalFactory.getProposalCount()).to.equal(0);
    });
  });

  describe("Creating Proposals", function () {
    it("Should create a proposal successfully", async function () {
      const title = "Test Proposal";
      const description = "This is a test proposal";
      const encodedAction = "0x1234567890abcdef";

      await expect(
        proposalFactory.connect(addr1).createProposal(title, description, encodedAction)
      )
        .to.emit(proposalFactory, "ProposalCreated")
        .withArgs(1, addr1.address, title, description, encodedAction);

      expect(await proposalFactory.getProposalCount()).to.equal(1);
    });

    it("Should assign correct proposal ID", async function () {
      const title = "Test Proposal";
      const description = "This is a test proposal";
      const encodedAction = "0x1234567890abcdef";

      const tx = await proposalFactory.connect(addr1).createProposal(title, description, encodedAction);
      const receipt = await tx.wait();
      
      // Get the proposal ID from the event
      const event = receipt?.logs.find(log => {
        try {
          const parsed = proposalFactory.interface.parseLog(log);
          return parsed?.name === 'ProposalCreated';
        } catch {
          return false;
        }
      });

      expect(event).to.not.be.undefined;
      
      const parsedEvent = proposalFactory.interface.parseLog(event!);
      const proposalId = parsedEvent?.args[0];
      
      expect(proposalId).to.equal(1);
    });

    it("Should store proposal data correctly", async function () {
      const title = "Test Proposal";
      const description = "This is a test proposal";
      const encodedAction = "0x1234567890abcdef";

      await proposalFactory.connect(addr1).createProposal(title, description, encodedAction);

      const proposal = await proposalFactory.getProposal(1);
      
      expect(proposal.id).to.equal(1);
      expect(proposal.proposer).to.equal(addr1.address);
      expect(proposal.title).to.equal(title);
      expect(proposal.description).to.equal(description);
      expect(proposal.encodedAction).to.equal(encodedAction);
      expect(proposal.status).to.equal(0); // Created status
      expect(proposal.createdAt).to.be.gt(0);
    });

    it("Should reject empty title", async function () {
      await expect(
        proposalFactory.connect(addr1).createProposal("", "Description", "0x1234")
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Should reject empty description", async function () {
      await expect(
        proposalFactory.connect(addr1).createProposal("Title", "", "0x1234")
      ).to.be.revertedWith("Description cannot be empty");
    });

    it("Should reject empty encoded action", async function () {
      await expect(
        proposalFactory.connect(addr1).createProposal("Title", "Description", "0x")
      ).to.be.revertedWith("Encoded action cannot be empty");
    });
  });

  describe("Marking Proposals as Executed", function () {
    beforeEach(async function () {
      await proposalFactory.connect(addr1).createProposal(
        "Test Proposal",
        "This is a test proposal",
        "0x1234567890abcdef"
      );
    });

    it("Should allow proposer to mark as executed", async function () {
      await expect(proposalFactory.connect(addr1).markAsExecuted(1))
        .to.emit(proposalFactory, "ProposalExecuted")
        .withArgs(1, addr1.address);

      const proposal = await proposalFactory.getProposal(1);
      expect(proposal.status).to.equal(1); // Executed status
    });

    it("Should reject non-proposer marking as executed", async function () {
      await expect(
        proposalFactory.connect(addr2).markAsExecuted(1)
      ).to.be.revertedWith("Only proposer can execute this action");
    });

    it("Should reject marking non-existent proposal", async function () {
      await expect(
        proposalFactory.connect(addr1).markAsExecuted(999)
      ).to.be.revertedWith("Proposal does not exist");
    });

    it("Should reject marking already executed proposal", async function () {
      await proposalFactory.connect(addr1).markAsExecuted(1);
      
      await expect(
        proposalFactory.connect(addr1).markAsExecuted(1)
      ).to.be.revertedWith("Proposal already executed");
    });
  });

  describe("Querying Proposals", function () {
    beforeEach(async function () {
      await proposalFactory.connect(addr1).createProposal(
        "Proposal 1",
        "First proposal",
        "0x1111"
      );
      await proposalFactory.connect(addr1).createProposal(
        "Proposal 2",
        "Second proposal",
        "0x2222"
      );
      await proposalFactory.connect(addr2).createProposal(
        "Proposal 3",
        "Third proposal",
        "0x3333"
      );
    });

    it("Should return correct proposer proposals", async function () {
      const addr1Proposals = await proposalFactory.getProposerProposals(addr1.address);
      const addr2Proposals = await proposalFactory.getProposerProposals(addr2.address);

      expect(addr1Proposals).to.have.lengthOf(2);
      expect(addr1Proposals[0]).to.equal(1);
      expect(addr1Proposals[1]).to.equal(2);

      expect(addr2Proposals).to.have.lengthOf(1);
      expect(addr2Proposals[0]).to.equal(3);
    });

    it("Should return correct proposal count", async function () {
      expect(await proposalFactory.getProposalCount()).to.equal(3);
    });

    it("Should return multiple proposals correctly", async function () {
      const proposals = await proposalFactory.getMultipleProposals([1, 3]);
      
      expect(proposals).to.have.lengthOf(2);
      expect(proposals[0].title).to.equal("Proposal 1");
      expect(proposals[1].title).to.equal("Proposal 3");
    });
  });
});